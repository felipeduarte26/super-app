export type AppLocale = 'pt-BR' | 'en-US' | 'es-ES';

export interface TranslationKeys {
  // Tabs
  'tab.home': string;
  'tab.profile': string;
  'tab.settings': string;

  // Home
  'home.greeting': string;
  'home.unread_notifications': string;
  'home.all_caught_up': string;
  'home.section_home': string;
  'home.module_federation_desc': string;
  'home.clean_architecture_desc': string;
  'home.event_bus_desc': string;
  'home.section_notifications': string;

  // Profile
  'profile.loading': string;
  'profile.section_profile': string;
  'profile.architecture_desc': string;
  'profile.section_personal': string;
  'profile.full_name': string;
  'profile.name_placeholder': string;
  'profile.email': string;
  'profile.email_placeholder': string;
  'profile.bio': string;
  'profile.bio_placeholder': string;
  'profile.save': string;
  'profile.member_since': string;

  // Settings
  'settings.title': string;
  'settings.subtitle': string;
  'settings.section_appearance': string;
  'settings.dark_theme': string;
  'settings.dark_theme_hint': string;
  'settings.section_language': string;
  'settings.language_hint': string;
  'settings.section_notifications': string;
  'settings.push_notifications': string;
  'settings.push_hint': string;
  'settings.biometric_login': string;
  'settings.biometric_hint': string;
  'settings.section_about': string;
  'settings.installed_version': string;
  'settings.about_footnote': string;
  'settings.reset_defaults': string;
}

const ptBR: TranslationKeys = {
  'tab.home': 'Início',
  'tab.profile': 'Perfil',
  'tab.settings': 'Ajustes',

  'home.greeting': 'Olá, {name}!',
  'home.unread_notifications': 'Você tem {count} notificações não lidas',
  'home.all_caught_up': 'Tudo em dia!',
  'home.section_home': 'Mini App: Home',
  'home.module_federation_desc':
    'Este módulo foi carregado remotamente pelo Host App via Re.Pack Module Federation.',
  'home.clean_architecture_desc':
    'Domain → Application → Data → Presentation. Cada camada com responsabilidade única.',
  'home.event_bus_desc':
    'Altere seu nome no Profile e veja o greeting acima mudar via EventBus.',
  'home.section_notifications': 'Notificações',

  'profile.loading': 'Carregando perfil…',
  'profile.section_profile': 'Mini App: Perfil',
  'profile.architecture_desc':
    'Domain → Application → Data → Presentation. Ao salvar, o perfil emite PROFILE_UPDATED no EventBus para outros módulos reagirem.',
  'profile.section_personal': 'Dados pessoais',
  'profile.full_name': 'Nome completo',
  'profile.name_placeholder': 'Seu nome',
  'profile.email': 'E-mail',
  'profile.email_placeholder': 'voce@email.com',
  'profile.bio': 'Bio',
  'profile.bio_placeholder': 'Conte um pouco sobre você',
  'profile.save': 'Salvar alterações',
  'profile.member_since': 'Membro desde {date}',

  'settings.title': 'Configurações',
  'settings.subtitle': 'Personalize aparência, idioma e privacidade',
  'settings.section_appearance': 'Aparência',
  'settings.dark_theme': 'Tema escuro',
  'settings.dark_theme_hint':
    'Alterações são emitidas no barramento para outros módulos.',
  'settings.section_language': 'Idioma',
  'settings.language_hint':
    'Idioma do app — evento disparado ao alterar a seleção.',
  'settings.section_notifications': 'Notificações',
  'settings.push_notifications': 'Notificações push',
  'settings.push_hint': 'Receber alertas e atualizações no dispositivo',
  'settings.biometric_login': 'Login com biometria',
  'settings.biometric_hint': 'Usar digital ou Face ID quando disponível',
  'settings.section_about': 'Sobre o App',
  'settings.installed_version': 'Versão instalada',
  'settings.about_footnote':
    'Super App — módulo de configurações com Module Federation',
  'settings.reset_defaults': 'Restaurar Padrões',
};

const enUS: TranslationKeys = {
  'tab.home': 'Home',
  'tab.profile': 'Profile',
  'tab.settings': 'Settings',

  'home.greeting': 'Hello, {name}!',
  'home.unread_notifications': 'You have {count} unread notifications',
  'home.all_caught_up': 'All caught up!',
  'home.section_home': 'Mini App: Home',
  'home.module_federation_desc':
    'This module was remotely loaded by the Host App via Re.Pack Module Federation.',
  'home.clean_architecture_desc':
    'Domain → Application → Data → Presentation. Each layer with a single responsibility.',
  'home.event_bus_desc':
    'Change your name in Profile and see the greeting above update via EventBus.',
  'home.section_notifications': 'Notifications',

  'profile.loading': 'Loading profile…',
  'profile.section_profile': 'Mini App: Profile',
  'profile.architecture_desc':
    'Domain → Application → Data → Presentation. On save, the profile emits PROFILE_UPDATED on EventBus for other modules to react.',
  'profile.section_personal': 'Personal data',
  'profile.full_name': 'Full name',
  'profile.name_placeholder': 'Your name',
  'profile.email': 'Email',
  'profile.email_placeholder': 'you@email.com',
  'profile.bio': 'Bio',
  'profile.bio_placeholder': 'Tell us a bit about yourself',
  'profile.save': 'Save changes',
  'profile.member_since': 'Member since {date}',

  'settings.title': 'Settings',
  'settings.subtitle': 'Customize appearance, language and privacy',
  'settings.section_appearance': 'Appearance',
  'settings.dark_theme': 'Dark theme',
  'settings.dark_theme_hint':
    'Changes are emitted on the event bus for other modules.',
  'settings.section_language': 'Language',
  'settings.language_hint':
    'App language — event dispatched when selection changes.',
  'settings.section_notifications': 'Notifications',
  'settings.push_notifications': 'Push notifications',
  'settings.push_hint': 'Receive alerts and updates on your device',
  'settings.biometric_login': 'Biometric login',
  'settings.biometric_hint': 'Use fingerprint or Face ID when available',
  'settings.section_about': 'About the App',
  'settings.installed_version': 'Installed version',
  'settings.about_footnote':
    'Super App — settings module with Module Federation',
  'settings.reset_defaults': 'Reset to Defaults',
};

const esES: TranslationKeys = {
  'tab.home': 'Inicio',
  'tab.profile': 'Perfil',
  'tab.settings': 'Ajustes',

  'home.greeting': '¡Hola, {name}!',
  'home.unread_notifications': 'Tienes {count} notificaciones sin leer',
  'home.all_caught_up': '¡Todo al día!',
  'home.section_home': 'Mini App: Home',
  'home.module_federation_desc':
    'Este módulo fue cargado remotamente por la Host App via Re.Pack Module Federation.',
  'home.clean_architecture_desc':
    'Domain → Application → Data → Presentation. Cada capa con responsabilidad única.',
  'home.event_bus_desc':
    'Cambia tu nombre en Perfil y ve el saludo arriba cambiar via EventBus.',
  'home.section_notifications': 'Notificaciones',

  'profile.loading': 'Cargando perfil…',
  'profile.section_profile': 'Mini App: Perfil',
  'profile.architecture_desc':
    'Domain → Application → Data → Presentation. Al guardar, el perfil emite PROFILE_UPDATED en EventBus para que otros módulos reaccionen.',
  'profile.section_personal': 'Datos personales',
  'profile.full_name': 'Nombre completo',
  'profile.name_placeholder': 'Tu nombre',
  'profile.email': 'Correo electrónico',
  'profile.email_placeholder': 'tu@email.com',
  'profile.bio': 'Bio',
  'profile.bio_placeholder': 'Cuéntanos un poco sobre ti',
  'profile.save': 'Guardar cambios',
  'profile.member_since': 'Miembro desde {date}',

  'settings.title': 'Configuración',
  'settings.subtitle': 'Personaliza apariencia, idioma y privacidad',
  'settings.section_appearance': 'Apariencia',
  'settings.dark_theme': 'Tema oscuro',
  'settings.dark_theme_hint':
    'Los cambios se emiten en el bus de eventos para otros módulos.',
  'settings.section_language': 'Idioma',
  'settings.language_hint':
    'Idioma de la app — evento emitido al cambiar la selección.',
  'settings.section_notifications': 'Notificaciones',
  'settings.push_notifications': 'Notificaciones push',
  'settings.push_hint': 'Recibir alertas y actualizaciones en el dispositivo',
  'settings.biometric_login': 'Inicio con biometría',
  'settings.biometric_hint':
    'Usar huella digital o Face ID cuando esté disponible',
  'settings.section_about': 'Sobre la App',
  'settings.installed_version': 'Versión instalada',
  'settings.about_footnote':
    'Super App — módulo de configuración con Module Federation',
  'settings.reset_defaults': 'Restaurar por Defecto',
};

export const translations: Record<AppLocale, TranslationKeys> = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es-ES': esES,
};
