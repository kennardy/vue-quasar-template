export default {
  email: (value: string) => {
    const pattern =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return pattern.test(value) || 'Некорректный e-mail'
  },
  required: (value: any) => !!value || 'Поле обязательно для заполнения',
  match: (p: any) => (v: any) => (v || '') === p || 'Пароли должны совпадать',
  length: (p: number) => (v: string) =>
    v.length >= p || `Минимальная длина ${p}`,
  password: (value: string) => {
    const pattern =
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!"#$%&'()*+,-.\/:;<=>?@\[\\\]^_`{|}~]{2,}$/
    return pattern.test(value) || 'Пароль должен содержать буквы и цифры'
  },
}
