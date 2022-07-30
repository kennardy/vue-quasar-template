import { api } from 'boot/axios'
import { AxiosResponse } from 'axios'
import {
  BaseAuthenticationUser,
  BaseAuthenticationUserRaw,
} from './baseAuthenticationUser'
import { BaseAuthenticationTokens, TokensRaw } from './baseAuthenticationTokens'

export class BaseAuthentication {
  user: BaseAuthenticationUser | null = null
  tokens: BaseAuthenticationTokens

  tokensClass = BaseAuthenticationTokens
  userClass = BaseAuthenticationUser

  settings = {
    urls: {
      login: '/token/',
      me: '/users/me/',
      register: '/users/',
      refresh: '/token/refresh/',
      changePassword: '/users/change_password/',
    },
    apiHeader: {
      key: 'Authorization',
      type: 'Bearer',
    },
  }

  constructor() {
    this.tokens = this.tokensClass.getFromStorage()
    this.setApiHeader()
  }

  async me() {
    if (!this.tokens.accessIsValid) throw Error('Access token is not valid.')
    this.user = await this._loadUser()
    return this.user
  }

  async refresh(): Promise<void> {
    const result: AxiosResponse<TokensRaw> = await api.post(
      this.settings.urls.refresh,
      { refresh: this.tokens.refresh }
    )
    this.tokens = new this.tokensClass(result.data.access, result.data.refresh)
    this.setApiHeader()
  }

  private async _loadUser(): Promise<BaseAuthenticationUser> {
    try {
      const response: AxiosResponse<BaseAuthenticationUserRaw> = await api.get(
        this.settings.urls.me
      )
      return new this.userClass(response.data)
    } catch (e) {
      throw Error('Fail with load user.')
    }
  }

  async login(data: any) {
    this.logout()
    try {
      const response: AxiosResponse<TokensRaw> = await api.post(
        this.settings.urls.login,
        data
      )
      this.tokens = new this.tokensClass(
        response.data.access,
        response.data.refresh
      )
      this.setApiHeader()
      this.user = await this._loadUser()
      return {
        user: this.user,
        tokens: this.tokens,
      }
    } catch (e) {
      throw Error('Fail login')
    }
  }

  async register(data: any) {
    this.logout()
    try {
      await api.post(this.settings.urls.register, data)
      return await this.login(data)
    } catch (e) {
      throw Error('Register fail')
    }
  }

  async changePassword(data: any) {
    try {
      return await api.post(this.settings.urls.changePassword, data)
    } catch (e) {
      throw Error('Change password fail')
    }
  }

  logout(): void {
    this.user = null
    this.tokens.removeTokens()
    Object.assign(api.defaults.headers, { Authorization: null })
  }

  setApiHeader(): void {
    const apiHeader = this.settings.apiHeader
    if (!this.tokens.access) return
    Object.assign(api.defaults.headers, {
      [apiHeader.key]: apiHeader.type
        ? `${apiHeader.type} ${this.tokens.access}`
        : this.tokens.access,
    })
  }
}
