const translation = {
  header: {
    title: 'Hexlet Chat',
    logout: 'Выйти',
  },
  common: {
    username: 'Имя пользователя',
    password: 'Пароль',
    cancel: 'Отмена',
  },
  errors: {
    server: 'Ошибка сервера. Попробуйте ещё раз',
    network: 'Ошибка сети. Попробуйте ещё раз',
  },
  login: {
    title: 'Войти',
    usernamePlaceholder: 'Введите имя пользователя',
    passwordPlaceholder: 'Введите пароль',
    submit: 'Войти',
    noAccount: 'Нет аккаунта?',
    signupLink: 'Зарегистрироваться',
    errors: {
      invalid: 'Неверные имя пользователя или пароль',
    },
  },
  signup: {
    title: 'Регистрация',
    usernamePlaceholder: 'От 3 до 20 символов',
    passwordPlaceholder: 'Не менее 6 символов',
    confirmLabel: 'Подтверждение пароля',
    confirmPlaceholder: 'Повторите пароль',
    submit: 'Зарегистрироваться',
    hasAccount: 'Уже есть аккаунт?',
    loginLink: 'Войти',
    validation: {
      usernameLength: 'Имя пользователя должно содержать от 3 до 20 символов',
      passwordLength: 'Пароль должен содержать не менее 6 символов',
      confirmRequired: 'Подтвердите пароль',
      passwordsMismatch: 'Пароли должны совпадать',
    },
    errors: {
      duplicate: 'Пользователь с таким именем уже существует',
    },
  },
  chat: {
    channels: 'Каналы',
    addChannel: 'Добавить канал',
    loading: 'Загрузка чата',
    loadErrorTitle: 'Ошибка загрузки',
    loadError: 'Не удалось загрузить данные чата. Попробуйте обновить страницу.',
    noChannel: 'Канал не выбран',
  },
  channels: {
    manage: 'Управление каналом {{name}}',
    rename: 'Переименовать',
    remove: 'Удалить',
  },
  messages: {
    empty: 'В этом канале пока нет сообщений',
    label: 'Новое сообщение',
    placeholder: 'Введите сообщение...',
    submit: 'Отправить',
    required: 'Введите сообщение',
    sendError: 'Не удалось отправить сообщение. Проверьте соединение и попробуйте ещё раз.',
  },
  modals: {
    add: {
      title: 'Добавить канал',
      label: 'Название канала',
      placeholder: 'Например, frontend',
      submit: 'Добавить',
      error: 'Не удалось добавить канал. Попробуйте ещё раз.',
    },
    rename: {
      title: 'Переименовать канал',
      label: 'Новое название канала',
      submit: 'Сохранить',
      error: 'Не удалось переименовать канал. Попробуйте ещё раз.',
    },
    remove: {
      title: 'Удалить канал',
      confirmation: 'Вы уверены, что хотите удалить канал # {{name}}? Все его сообщения также будут удалены.',
      submit: 'Удалить',
      error: 'Не удалось удалить канал. Попробуйте ещё раз.',
    },
  },
  validation: {
    channelLength: 'Название канала должно содержать от 3 до 20 символов',
    channelExists: 'Канал с таким именем уже существует',
  },
  notFound: {
    title: '404',
    text: 'Страница не найдена',
    home: 'Вернуться на главную',
  },
};

export default translation;
