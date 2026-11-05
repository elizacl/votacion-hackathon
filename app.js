/**
 * ====================================================================
 * LÓGICA DE LA APLICACIÓN CLIENTE (SPA)
 * Hackathon ENEISOFT XVI 2026 — FISI · UNMSM
 * ====================================================================
 */

/**
     * Estado Global de la Aplicación
     */
    let authenticatedUser = {
      email: null,
      equipo: null
    };

    // Podio: { 1: teamObject, 2: teamObject, 3: teamObject }
    let podiumState = {
      1: null,
      2: null,
      3: null
    };

    let sortableInstances = [];

    // ========================================================
    // PANTALLA 1: AUTENTICACIÓN Y VALIDACIÓN
    // ========================================================

    async function handleAuthSubmit(event) {
      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }
      clearAuthError();

      const emailInput = document.getElementById('input-email');
      const inputEmail = emailInput.value.trim().toLowerCase();

      if (!inputEmail) {
        showAuthError("Por favor, ingresa una dirección de correo válida.");
        return;
      }

      // 1. Validar si el correo pertenece a algún equipo (case-insensitive)
      const matchedTeam = baseEquipos.find(eq =>
        eq.correos.some(c => c.trim().toLowerCase() === inputEmail)
      );

      if (!matchedTeam) {
        showAuthError("Acceso denegado: El correo ingresado no pertenece a ningún equipo clasificado para la Hackathon.");
        return;
      }

      // Iniciar estado de carga en botón
      setAuthLoading(true);

      // 2. Consulta HTTP GET a WEB_APP_URL: ?action=check&equipo=NombreDelEquipo
      try {
        const checkUrl = `${WEB_APP_URL}?action=check&equipo=${encodeURIComponent(matchedTeam.nombre)}`;

        // Verificamos si no es una URL de demostración local
        const isPlaceholderUrl = WEB_APP_URL.includes("YOUR_DEPLOYMENT_ID");

        if (!isPlaceholderUrl) {
          const response = await fetch(checkUrl, { method: "GET" });
          if (response.ok) {
            const data = await response.json();
            if (data && data.alreadyVoted === true) {
              setAuthLoading(false);
              showAuthError("Acceso denegado: Alguien de tu equipo ya emitió el voto.");
              return;
            }
          }
        } else {
          // En modo demo con placeholder, validamos si existe voto local en localStorage
          const localVoted = localStorage.getItem(`voted_${matchedTeam.nombre}`);
          if (localVoted === "true") {
            setAuthLoading(false);
            showAuthError("Acceso denegado: Alguien de tu equipo ya emitió el voto.");
            return;
          }
        }
      } catch (error) {
        console.warn("Aviso de verificación en red (posible CORS o endpoint en espera):", error);
        // Si hay error de red o URL aún no desplegada, validamos por bandera local para permitir pruebas fluidas
        const localVoted = localStorage.getItem(`voted_${matchedTeam.nombre}`);
        if (localVoted === "true") {
          setAuthLoading(false);
          showAuthError("Acceso denegado: Alguien de tu equipo ya emitió el voto.");
          return;
        }
      }

      setAuthLoading(false);

      // Autenticación Exitosa: Guardar estado y proceder a la Pantalla 2
      authenticatedUser.email = inputEmail;
      authenticatedUser.equipo = matchedTeam;

      initVotingScreen();
      return false;
    }

    function showAuthError(message) {
      const errorBox = document.getElementById('auth-error-box');
      const errorMsg = document.getElementById('auth-error-msg');
      errorMsg.textContent = message;
      errorBox.classList.remove('hidden');
    }

    function clearAuthError() {
      const errorBox = document.getElementById('auth-error-box');
      errorBox.classList.add('hidden');
    }

    function setAuthLoading(isLoading) {
      const submitBtn = document.getElementById('btn-auth-submit');
      const btnText = document.getElementById('btn-auth-text');
      const btnIcon = document.getElementById('btn-auth-icon');
      const btnSpinner = document.getElementById('btn-auth-spinner');

      if (isLoading) {
        submitBtn.disabled = true;
        btnText.textContent = "VERIFICANDO ESTADO...";
        btnIcon.classList.add('hidden');
        btnSpinner.classList.remove('hidden');
      } else {
        submitBtn.disabled = false;
        btnText.textContent = "VERIFICAR IDENTIDAD Y VOTAR";
        btnIcon.classList.remove('hidden');
        btnSpinner.classList.add('hidden');
      }
    }


    // ========================================================
    // PANTALLA 2: INTERFAZ DRAG & DROP Y PODIO
    // ========================================================

    function initVotingScreen() {
      // Transición visual entre Pantalla 1 y Pantalla 2
      document.getElementById('screen-auth').classList.add('hidden');
      document.getElementById('screen-voting').classList.remove('hidden');

      // Actualizar encabezado del votante
      document.getElementById('auth-team-name').textContent = authenticatedUser.equipo.nombre;
      document.getElementById('auth-voter-email').textContent = authenticatedUser.email;

      // Resetear estado del podio
      podiumState = { 1: null, 2: null, 3: null };

      // Renderizar la lista de equipos disponibles con Filtro Estricto:
      // El propio equipo del votante NO debe aparecer en la lista (prohibición de autovoto)
      renderAvailableTeams();

      // Inicializar SortableJS para drag & drop fluido en móviles y escritorios
      setupSortableLists();

      // Actualizar vista del podio
      updatePodiumUI();

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Renderiza los 11 equipos disponibles (excluyendo el equipo del votante autenticado)
     */
    function renderAvailableTeams(filterQuery = "") {
      const pool = document.getElementById('pool-teams');
      pool.innerHTML = "";

      const query = filterQuery.trim().toLowerCase();

      // Filtro estricto: excluir el propio equipo
      const eligibleTeams = baseEquipos.filter(eq =>
        eq.nombre.trim().toLowerCase() !== authenticatedUser.equipo.nombre.trim().toLowerCase()
      );

      // Excluir también aquellos equipos que ya están colocados en el podio
      const teamsInPodium = Object.values(podiumState).filter(Boolean).map(t => t.nombre.toLowerCase());

      const availableTeams = eligibleTeams.filter(eq =>
        !teamsInPodium.includes(eq.nombre.toLowerCase()) &&
        (query === "" || eq.nombre.toLowerCase().includes(query))
      );

      document.getElementById('available-teams-count').textContent = `${availableTeams.length} disponibles`;

      if (availableTeams.length === 0) {
        document.getElementById('pool-empty-notice').classList.remove('hidden');
      } else {
        document.getElementById('pool-empty-notice').classList.add('hidden');
      }

      availableTeams.forEach((team, index) => {
        const card = createTeamCardElement(team, false);
        pool.appendChild(card);
      });
    }

    /**
     * Crea un elemento DOM para la tarjeta de un equipo
     */
    function createTeamCardElement(team, isPlacedInPodium = false, slotNumber = null) {
      const card = document.createElement('div');
      card.className = `team-card group relative p-3.5 sm:p-4 rounded-xl ${isPlacedInPodium
        ? 'bg-[#071320] border border-white/20 shadow-md w-full'
        : 'bg-[#071810] border border-[#24ed7a]/25 hover:border-[#24ed7a]/60 shadow-lg hover:shadow-[0_0_20px_rgba(36,237,122,0.15)] transition-all'
        } cursor-grab active:cursor-grabbing select-none`;

      card.setAttribute('data-team-name', team.nombre);

      // Si está en el podio, mostramos diseño limpio con botón para remover
      if (isPlacedInPodium) {
        card.innerHTML = `
          <div class="flex items-center justify-between gap-3">
            <h5 class="text-sm font-bold text-white truncate min-w-0">${team.nombre}</h5>
            <button 
              type="button" 
              onclick="removeFromPodium(${slotNumber})" 
              class="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-mono-custom flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
              title="Quitar del podio"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
              <span>Quitar</span>
            </button>
          </div>
        `;
      } else {
        // Tarjeta en la piscina de disponibles (Limpia y arrastrable)
        card.innerHTML = `
          <div class="flex items-center gap-2.5">
            <span class="cursor-grab text-neutral-500 group-hover:text-[#24ed7a] transition-colors shrink-0">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/>
              </svg>
            </span>
            <h5 class="text-sm font-bold text-white group-hover:text-[#24ed7a] transition-colors leading-snug">
              ${team.nombre}
            </h5>
          </div>
        `;
      }

      return card;
    }

    /**
     * Inicializa los contenedores SortableJS
     */
    function setupSortableLists() {
      // Destruir instancias previas si existen
      sortableInstances.forEach(inst => inst.destroy());
      sortableInstances = [];

      const poolEl = document.getElementById('pool-teams');

      // Instancia para el contenedor de equipos disponibles
      const poolSortable = new Sortable(poolEl, {
        group: {
          name: 'podium-group',
          pull: true,
          put: true
        },
        animation: 200,
        ghostClass: 'sortable-ghost',
        chosenClass: 'sortable-chosen',
        dragClass: 'sortable-drag',
        delay: 50,
        delayOnTouchOnly: true,
        touchStartThreshold: 5,
        onAdd: function (evt) {
          // Si un elemento regresa a la piscina
          syncPodiumStateFromDOM();
        }
      });
      sortableInstances.push(poolSortable);

      // Instancias para los 3 casilleros del podio
      [1, 2, 3].forEach(slotNum => {
        const slotEl = document.getElementById(`slot-drop-${slotNum}`);

        const slotSortable = new Sortable(slotEl, {
          group: {
            name: 'podium-group',
            put: function (to, from, item) {
              // Permitir solo 1 tarjeta por casillero
              const currentCards = to.el.querySelectorAll('.team-card');
              return currentCards.length === 0;
            }
          },
          animation: 200,
          ghostClass: 'sortable-ghost',
          chosenClass: 'sortable-chosen',
          dragClass: 'sortable-drag',
          delay: 50,
          delayOnTouchOnly: true,
          touchStartThreshold: 5,
          onAdd: function (evt) {
            syncPodiumStateFromDOM();
          },
          onRemove: function (evt) {
            syncPodiumStateFromDOM();
          }
        });
        sortableInstances.push(slotSortable);
      });
    }

    /**
     * Sincroniza el estado de podiumState leyendo directamente el DOM
     */
    function syncPodiumStateFromDOM() {
      [1, 2, 3].forEach(slotNum => {
        const slotEl = document.getElementById(`slot-drop-${slotNum}`);
        const cardEl = slotEl.querySelector('.team-card');
        if (cardEl) {
          const teamName = cardEl.getAttribute('data-team-name');
          const teamObj = baseEquipos.find(t => t.nombre === teamName);
          podiumState[slotNum] = teamObj || null;
        } else {
          podiumState[slotNum] = null;
        }
      });

      updatePodiumUI();
      renderAvailableTeams(document.getElementById('search-teams').value);
      setupSortableLists();
    }

    /**
     * Asigna un equipo directamente a un puesto del podio
     */
    function assignTeamToSlot(teamName, slotNum) {
      const team = baseEquipos.find(t => t.nombre === teamName);
      if (!team) return;

      // Si el equipo ya estaba en otro puesto del podio, liberarlo
      [1, 2, 3].forEach(s => {
        if (podiumState[s] && podiumState[s].nombre === teamName) {
          podiumState[s] = null;
        }
      });

      // Asignar al casillero deseado
      podiumState[slotNum] = team;

      updatePodiumUI();
      renderAvailableTeams(document.getElementById('search-teams').value);
      setupSortableLists();
    }

    /**
     * Quita un equipo de un puesto del podio y lo devuelve a disponibles
     */
    function removeFromPodium(slotNum) {
      podiumState[slotNum] = null;
      updatePodiumUI();
      renderAvailableTeams(document.getElementById('search-teams').value);
      setupSortableLists();
    }

    /**
     * Actualiza la interfaz gráfica de los 3 casilleros del podio
     */
    function updatePodiumUI() {
      let filledCount = 0;

      [1, 2, 3].forEach(slotNum => {
        const slotEl = document.getElementById(`slot-drop-${slotNum}`);
        const team = podiumState[slotNum];
        slotEl.innerHTML = "";

        if (team) {
          filledCount++;
          const card = createTeamCardElement(team, true, slotNum);
          slotEl.appendChild(card);
        } else {
          // Mostrar placeholder
          const placeholder = document.createElement('div');
          placeholder.className = "slot-placeholder pointer-events-none flex flex-col items-center justify-center text-center p-3";

          let colorClass = slotNum === 1 ? "text-[#24ed7a]" : (slotNum === 2 ? "text-[#00c8df]" : "text-amber-400");
          let pointsLabel = slotNum === 1 ? "+3 pts" : (slotNum === 2 ? "+2 pts" : "+1 pt");

          placeholder.innerHTML = `
            <svg class="w-5 h-5 ${colorClass}/40 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
            <span class="text-xs font-mono-custom text-neutral-500">Arrastra aquí (${pointsLabel})</span>
          `;
          slotEl.appendChild(placeholder);
        }
      });

      // Actualizar contador y estado del botón de envío
      const statusBadge = document.getElementById('podium-status-badge');
      const submitBtn = document.getElementById('btn-submit-vote');
      const validationHint = document.getElementById('submit-validation-hint');

      statusBadge.textContent = `${filledCount} / 3 Asignados`;

      if (filledCount === 3) {
        statusBadge.className = "px-2.5 py-1 rounded-full text-xs font-mono-custom bg-[#24ed7a]/15 text-[#24ed7a] border border-[#24ed7a]/30";
        submitBtn.disabled = false;
        validationHint.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-[#24ed7a]"></span>
          <span class="text-[#24ed7a]">¡Podio completo! Puedes emitir tu voto confidencial.</span>
        `;
      } else {
        statusBadge.className = "px-2.5 py-1 rounded-full text-xs font-mono-custom bg-amber-400/10 text-amber-300 border border-amber-400/30";
        submitBtn.disabled = true;
        validationHint.innerHTML = `
          <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span>Completa los 3 puestos para habilitar el envío oficial.</span>
        `;
      }
    }

    function filterAvailableTeams(val) {
      renderAvailableTeams(val);
      setupSortableLists();
    }


    // ========================================================
    // PANTALLA 3: MODAL DE CONFIRMACIÓN Y ENVÍO FINAL
    // ========================================================

    function promptConfirmVote() {
      // Validar que los tres casilleros estén ocupados
      if (!podiumState[1] || !podiumState[2] || !podiumState[3]) {
        alert("Atención: Debes colocar un equipo en cada uno de los 3 puestos del podio antes de enviar.");
        return;
      }

      document.getElementById('confirm-slot-1').textContent = podiumState[1].nombre;
      document.getElementById('confirm-slot-2').textContent = podiumState[2].nombre;
      document.getElementById('confirm-slot-3').textContent = podiumState[3].nombre;

      document.getElementById('modal-confirm').classList.remove('hidden');
    }

    function closeConfirmModal() {
      document.getElementById('modal-confirm').classList.add('hidden');
    }

    async function executeFinalVoteSubmission() {
      const confirmBtn = document.getElementById('btn-confirm-final-submit');
      const confirmText = document.getElementById('btn-confirm-text');
      const confirmSpinner = document.getElementById('btn-confirm-spinner');

      confirmBtn.disabled = true;
      confirmText.textContent = "Transmitiendo...";
      confirmSpinner.classList.remove('hidden');

      const teamName = authenticatedUser.equipo ? authenticatedUser.equipo.nombre : "";
      const voterEmail = authenticatedUser.email || "";

      // Objeto JSON con compatibilidad total para Google Apps Script
      const votePayload = {
        action: "vote",
        // Identificadores de Equipo Votante:
        equipo: teamName,
        equipoVotante: teamName,
        equipo_votante: teamName,
        nombreEquipo: teamName,
        "Equipo Votante": teamName,

        // Identificadores de Correo del Votante:
        correo: voterEmail,
        correoVotante: voterEmail,
        correo_votante: voterEmail,
        correoDelVotante: voterEmail,
        correo_del_votante: voterEmail,
        correoResponsable: voterEmail,
        email: voterEmail,
        "Correo del Votante": voterEmail,

        // Puestos del Podio:
        puesto1: podiumState[1] ? podiumState[1].nombre : "",
        puesto2: podiumState[2] ? podiumState[2].nombre : "",
        puesto3: podiumState[3] ? podiumState[3].nombre : "",
        "1er Puesto (+3 pts)": podiumState[1] ? podiumState[1].nombre : "",
        "2do Puesto (+2 pts)": podiumState[2] ? podiumState[2].nombre : "",
        "3er Puesto (+1 pt)": podiumState[3] ? podiumState[3].nombre : "",

        timestamp: new Date().toISOString()
      };

      try {
        const isPlaceholderUrl = WEB_APP_URL.includes("YOUR_DEPLOYMENT_ID");

        if (!isPlaceholderUrl) {
          // Uso de modo no-cors en el fetch para evitar bloqueos con Google Apps Script
          await fetch(WEB_APP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: {
              "Content-Type": "text/plain;charset=utf-8"
            },
            body: JSON.stringify(votePayload)
          });
        }

        // Marcar en localStorage como salvaguarda en local
        localStorage.setItem(`voted_${authenticatedUser.equipo.nombre}`, "true");

      } catch (error) {
        console.warn("Aviso en el envío HTTP POST (no-cors / GAS endpoint):", error);
        // Continuamos al flujo de confirmación ya que mode: no-cors es opaco
        localStorage.setItem(`voted_${authenticatedUser.equipo.nombre}`, "true");
      }

      // Pequeño retardo cosmético para sensación de encriptación y transmisión
      setTimeout(() => {
        closeConfirmModal();
        showSuccessScreen(votePayload);
      }, 700);
    }

    /**
     * Muestra la Pantalla 3: Éxito con check verde y resumen
     */
    function showSuccessScreen(payload) {
      // Ocultar formulario de votación
      document.getElementById('screen-voting').classList.add('hidden');

      // Mostrar pantalla de éxito
      const successScreen = document.getElementById('screen-success');
      successScreen.classList.remove('hidden');

      // Completar datos del resumen
      document.getElementById('success-team-name').textContent = payload.equipo;
      document.getElementById('summary-rank-1').textContent = payload.puesto1;
      document.getElementById('summary-rank-2').textContent = payload.puesto2;
      document.getElementById('summary-rank-3').textContent = payload.puesto3;
      document.getElementById('summary-voter-email').textContent = payload.correo;

      const dateObj = new Date();
      document.getElementById('summary-timestamp').textContent = dateObj.toLocaleString('es-PE', {
        dateStyle: 'short',
        timeStyle: 'medium'
      });

      // Lanzar fuegos artificiales de confeti
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#24ed7a', '#00c8df', '#ffffff', '#fbbf24']
        });
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function handleLogout() {
      if (confirm("¿Estás seguro de que deseas salir? Los puestos seleccionados no se guardarán hasta que se emita el voto.")) {
        authenticatedUser = { email: null, equipo: null };
        podiumState = { 1: null, 2: null, 3: null };
        document.getElementById('screen-voting').classList.add('hidden');
        document.getElementById('screen-auth').classList.remove('hidden');
        document.getElementById('input-email').value = "";
        clearAuthError();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }


    function escapeHtml(str) {
      return str.replace(/'/g, "\\'");
    }