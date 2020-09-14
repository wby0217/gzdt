import create from 'zustand';

/**
 * 登陆用户的信息
 */
export enum UserRole {
  SYSTEM_ADMIN,
  USER,
  ANONYMOUS
}

export interface GlobalUserInfo {
  username: string;
  token: string;
  role: UserRole;
}

export interface GlobalUserState {
  globalUser: GlobalUserInfo;
  updateGlobalUser: (userInfo: GlobalUserInfo) => void;
}

export const [useGlobalUserStore, globalUserStoreApi] = create<GlobalUserState>((set) => ({
  globalUser: {} as GlobalUserInfo,
  updateGlobalUser: (domain) => set((state) => ({ globalUser: { ...domain } }))
}));
