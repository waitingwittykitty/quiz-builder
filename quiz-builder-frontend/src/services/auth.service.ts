import instance from './instance';

class AuthService {
  async signIn(email: string, password: string) {
    const { data } = await instance.post('login', {
      email,
      password,
    });

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  }
  signOut() {
    localStorage.removeItem('token');
  }
  signUp(email: string, password: string) {
    return instance.post('register', {
      email,
      password,
    });
  }
  async getCurrentUser() {
    const { data } = await instance.get('profile');

    if (data.token) {
      localStorage.setItem('token', data.token);
    }

    return data;
  }
}

export default new AuthService();
