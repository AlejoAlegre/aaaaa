// ============================================
// SCROLL TO SECTION
// ============================================
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// MODAL SYSTEM
// ============================================
const overlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');

function openModal(type) {
  const content = getModalContent(type);
  modalContent.innerHTML = content;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ============================================
// SERVICE MODALS
// ============================================
const serviceData = {
  diseno: {
    icon: '🎨',
    title: 'Diseño Web',
    desc: 'Creamos interfaces modernas, intuitivas y atractivas que representan tu marca y convierten visitantes en clientes.',
    features: ['Diseño responsive para móvil y escritorio', 'UI/UX centrado en el usuario', 'Prototipado y wireframes', 'Identidad visual y branding', 'Optimización de conversión (CRO)'],
    price: 'Desde 800€',
  },
  desarrollo: {
    icon: '⚡',
    title: 'Desarrollo Full-Stack',
    desc: 'Desarrollamos aplicaciones web completas, robustas y escalables usando las tecnologías más modernas del mercado.',
    features: ['Frontend con React / Vue / Next.js', 'Backend con Node.js / Python', 'Bases de datos SQL y NoSQL', 'APIs REST y GraphQL', 'Despliegue en la nube'],
    price: 'Desde 2.000€',
  },
  ia: {
    icon: '🤖',
    title: 'IA & Chatbots',
    desc: 'Integramos inteligencia artificial en tu negocio para automatizar procesos, mejorar la atención al cliente y aumentar la productividad.',
    features: ['Chatbots con Claude / GPT-4', 'Automatización de tareas repetitivas', 'Análisis de datos con IA', 'Recomendaciones personalizadas', 'Integración con tus sistemas actuales'],
    price: 'Desde 1.200€',
  },
  marketing: {
    icon: '📈',
    title: 'Marketing Digital',
    desc: 'Estrategias de crecimiento basadas en datos reales para maximizar tu ROI y hacer crecer tu negocio online.',
    features: ['SEO y posicionamiento web', 'Google Ads y Meta Ads', 'Email marketing', 'Gestión de redes sociales', 'Analítica y reportes mensuales'],
    price: 'Desde 500€/mes',
  },
  seguridad: {
    icon: '🔒',
    title: 'Ciberseguridad',
    desc: 'Protegemos tu empresa con las mejores herramientas y prácticas de seguridad para mantener tus datos y sistemas a salvo.',
    features: ['Auditorías de seguridad', 'Pruebas de penetración (pentesting)', 'Protección contra malware y ataques', 'Cifrado de datos sensibles', 'Formación para empleados'],
    price: 'Desde 1.000€',
  },
  cloud: {
    icon: '☁️',
    title: 'Cloud & DevOps',
    desc: 'Optimizamos tu infraestructura en la nube para reducir costes, mejorar el rendimiento y garantizar la disponibilidad 24/7.',
    features: ['AWS, Google Cloud y Azure', 'CI/CD y automatización', 'Contenedores con Docker y Kubernetes', 'Monitorización y alertas', 'Backup y recuperación ante desastres'],
    price: 'Desde 600€/mes',
  },
};

function openServiceModal(key) {
  const s = serviceData[key];
  if (!s) return;
  openModal('_raw_' + key);
  modalContent.innerHTML = `
    <div class="modal-service">
      <div class="modal-service-header">
        <span class="modal-icon">${s.icon}</span>
        <div>
          <h2>${s.title}</h2>
          <span class="modal-price">${s.price}</span>
        </div>
      </div>
      <p class="modal-desc">${s.desc}</p>
      <h4>¿Qué incluye?</h4>
      <ul class="modal-features">
        ${s.features.map(f => `<li>✅ ${f}</li>`).join('')}
      </ul>
      <button class="btn-primary modal-cta" onclick="closeModal(); scrollToSection('contacto')">
        Solicitar presupuesto →
      </button>
    </div>
  `;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ============================================
// TEAM MODAL
// ============================================
function openTeamModal() {
  const team = [
    { name: 'Carlos Ruiz', role: 'CEO & Fundador', emoji: '🧑‍💼' },
    { name: 'Ana García', role: 'Directora de Diseño', emoji: '👩‍🎨' },
    { name: 'Luis Martínez', role: 'Lead Developer', emoji: '🧑‍💻' },
    { name: 'María López', role: 'Marketing Manager', emoji: '👩‍📊' },
    { name: 'David Chen', role: 'DevOps Engineer', emoji: '🧑‍🔧' },
    { name: 'Sofia Torres', role: 'UX Researcher', emoji: '👩‍🔬' },
  ];

  modalContent.innerHTML = `
    <div class="modal-team">
      <h2>Nuestro Equipo</h2>
      <p>Conoce a las personas que hacen posible la magia.</p>
      <div class="team-grid">
        ${team.map(m => `
          <div class="team-card">
            <div class="team-emoji">${m.emoji}</div>
            <strong>${m.name}</strong>
            <span>${m.role}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

// ============================================
// LEGAL / INFO MODALS
// ============================================
function getModalContent(type) {
  const contents = {
    blog: `
      <div class="modal-info">
        <h2>📝 Blog</h2>
        <p>Próximamente publicaremos artículos sobre tecnología, diseño, marketing digital e inteligencia artificial.</p>
        <p>¡Suscríbete para ser el primero en enterarte!</p>
        <input type="email" placeholder="Tu email" class="modal-input" />
        <button class="btn-primary" onclick="alert('¡Gracias! Te avisaremos cuando lancemos el blog.'); closeModal()">Suscribirme</button>
      </div>
    `,
    careers: `
      <div class="modal-info">
        <h2>💼 Trabaja con nosotros</h2>
        <p>Buscamos personas apasionadas por la tecnología y el diseño. ¿Eres una de ellas?</p>
        <div class="careers-list">
          <div class="career-item">
            <strong>Frontend Developer</strong>
            <span>React · Remoto · Full-time</span>
            <button class="btn-secondary" onclick="scrollToSection('contacto'); closeModal()">Aplicar →</button>
          </div>
          <div class="career-item">
            <strong>UX/UI Designer</strong>
            <span>Figma · Híbrido · Full-time</span>
            <button class="btn-secondary" onclick="scrollToSection('contacto'); closeModal()">Aplicar →</button>
          </div>
          <div class="career-item">
            <strong>Marketing Specialist</strong>
            <span>SEO/SEM · Remoto · Part-time</span>
            <button class="btn-secondary" onclick="scrollToSection('contacto'); closeModal()">Aplicar →</button>
          </div>
        </div>
      </div>
    `,
    privacidad: `
      <div class="modal-info">
        <h2>🔒 Política de Privacidad</h2>
        <p><strong>Última actualización:</strong> Enero 2025</p>
        <p>En MiEmpresa nos tomamos muy en serio la privacidad de nuestros usuarios. Esta política describe cómo recopilamos, usamos y protegemos tu información personal.</p>
        <h4>Datos que recopilamos</h4>
        <p>Únicamente recopilamos los datos que nos proporcionas voluntariamente a través del formulario de contacto (nombre, email y mensaje).</p>
        <h4>Uso de los datos</h4>
        <p>Usamos tus datos exclusivamente para responder a tu consulta. No los vendemos ni compartimos con terceros.</p>
        <h4>Tus derechos</h4>
        <p>Puedes solicitar la eliminación de tus datos en cualquier momento escribiéndonos a privacidad@miempresa.com.</p>
      </div>
    `,
    terminos: `
      <div class="modal-info">
        <h2>📄 Términos y Condiciones</h2>
        <p><strong>Última actualización:</strong> Enero 2025</p>
        <p>Al usar este sitio web aceptas los siguientes términos y condiciones de uso.</p>
        <h4>Uso del sitio</h4>
        <p>Este sitio web es de carácter informativo. Todo el contenido es propiedad de MiEmpresa y no puede ser reproducido sin autorización.</p>
        <h4>Servicios</h4>
        <p>Los precios y condiciones de los servicios se acuerdan individualmente con cada cliente mediante contrato.</p>
        <h4>Responsabilidad</h4>
        <p>MiEmpresa no se responsabiliza por daños derivados del uso incorrecto de la información publicada en este sitio.</p>
      </div>
    `,
    cookies: `
      <div class="modal-info">
        <h2>🍪 Política de Cookies</h2>
        <p>Este sitio web utiliza cookies para mejorar la experiencia del usuario.</p>
        <h4>¿Qué son las cookies?</h4>
        <p>Las cookies son pequeños archivos de texto que se almacenan en tu navegador cuando visitas una página web.</p>
        <h4>Cookies que usamos</h4>
        <ul style="padding-left:1.2rem; color: var(--text-muted); margin: 0.5rem 0 1rem;">
          <li><strong>Cookies esenciales:</strong> necesarias para el funcionamiento básico del sitio.</li>
          <li><strong>Cookies de análisis:</strong> para entender cómo los usuarios usan el sitio (anónimas).</li>
        </ul>
        <h4>Cómo desactivarlas</h4>
        <p>Puedes desactivar las cookies desde la configuración de tu navegador en cualquier momento.</p>
        <button class="btn-primary" onclick="closeModal()">Aceptar cookies</button>
      </div>
    `,
  };
  return contents[type] || '<p>Contenido no encontrado.</p>';
}

// ============================================
// CONTACT FORM
// ============================================
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const btn = this.querySelector('button[type="submit"]');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  // Simulate sending (replace with real API call if needed)
  setTimeout(() => {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('formSuccess').style.display = 'flex';
  }, 1200);
});

function resetForm() {
  document.getElementById('contactForm').reset();
  document.getElementById('contactForm').style.display = 'flex';
  document.getElementById('formSuccess').style.display = 'none';
  const btn = document.querySelector('#contactForm button[type="submit"]');
  btn.textContent = 'Enviar mensaje';
  btn.disabled = false;
}
