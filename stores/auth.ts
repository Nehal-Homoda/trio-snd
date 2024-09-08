import { defineStore } from "pinia";
import { useSharedStore } from "~/stores/shared";
import type { AuthResponse, User } from "~/interfaces/auth/auth.interface";
import type { ResponseError } from "~/interfaces/response/response.interface";
import { useNotification } from "@kyvg/vue3-notification";
import { Meta } from "#build/components";

export const useAuthStore = defineStore("auth", () => {
  // /*##########[ DEFINES ]##########*/
  const userType = ref("user");
  const sharedStore = useSharedStore();
  const { notify } = useNotification()
  const userCookie = useCookie<User | null>('userCookie')
  const isLoggedInCookie = useCookie<boolean>('isLoggedInCookie')
  const tokenCookie = useCookie<string | null>('tokenCookie')
  // /*##########[ STATE ]##########*/
  const user = ref<User | null>(null);
  const isLoggedIn = ref<boolean>(false);
  const token = ref<string>("");
  const authError = ref<ResponseError>();
  const resetPasswordSuccessMessage = ref("");
  const isPasswordChange = ref(false);


  // /*##########[ COMPUTED ]##########*/

  // /*##########[ MUTATIONS ]##########*/
  const SET_ERROR = (error: any) => {
    try {
      if (error.data) {
        const data = error.data as ResponseError;

        authError.value = data;

        console.log(authError.value);
      }
    } catch (error) { }
  };
  const SET_TOKEN = (t: string) => {
    token.value = t;
    // SET COOKIE
    tokenCookie.value = t
  };
  const DISTROY_TOKEN = () => {

    tokenCookie.value = null;
    token.value = "";
  };
  const SET_AUTH = (response: AuthResponse) => {
    user.value = response.data;
    isLoggedIn.value = response.success;
    // SET COOKIES
    isLoggedInCookie.value = response.success;
    userCookie.value = response.data;
  };
  const DISTROY_AUTH = () => {

    user.value = null;
    isLoggedIn.value = false;
    authError.value = undefined;

    DISTROY_TOKEN();
    isLoggedInCookie.value = false;
    userCookie.value = null;
  };

  const enter = () => {
    try {
      authError.value = undefined;

      const storedToken = tokenCookie.value;
      const storedUser = userCookie.value;
      const storedIsLoggedIn = isLoggedInCookie.value;
      if (
        !!storedToken &&
        !!storedUser &&
        !!storedIsLoggedIn
      ) {
        token.value = storedToken;
        user.value = storedUser;
        isLoggedIn.value = storedIsLoggedIn ? true : false;
      } else {
        DISTROY_AUTH();
      }
    } catch (error) {
      DISTROY_AUTH();
    }
  };
  const profile = async () => {
    authError.value = undefined;
    await useAppFetch<AuthResponse>()
      .meEvent()
      .then((response) => {
        SET_AUTH(response);
      })
      .catch((error) => {
        DISTROY_AUTH();
        SET_ERROR(error);
      })
      .finally(() => { });
  };
  const login = async (formData: FormData) => {
    authError.value = undefined;
    await useAppFetch<AuthResponse>()
      .loginEvent(formData)
      .then((response) => {
        SET_AUTH(response);
        SET_TOKEN(response.meta.token);
      })
      .catch((error) => {
        DISTROY_AUTH();
        SET_ERROR(error);
      })
      .finally(() => { });
  };
  const loginWithSocial = async (formData: FormData) => {
    authError.value = undefined;
    await useAppFetch<AuthResponse>()
      .loginWithSocialEvent(formData)
      .then((response) => {
        SET_AUTH(response);
        SET_TOKEN(response.meta.token);
      })
      .catch((error) => {
        SET_ERROR(error);
        DISTROY_AUTH();
      })
      .finally(() => { });
  };
  const resetPassword = async (formData: FormData) => {
    authError.value = undefined;
    await useAppFetch<AuthResponse>()
      .resetPasswordEvent(formData)
      .then((response) => {
        resetPasswordSuccessMessage.value = response.meta.message;
      })
      .catch((error) => {
        SET_ERROR(error);
      })
      .finally(() => { });
  };
  const register = async (formData: FormData) => {
    authError.value = undefined;
    await useAppFetch<AuthResponse>()
      .registerEvent(formData)
      .then((response) => {
        SET_AUTH(response);
        SET_TOKEN(response.meta.token);
      })
      .catch((error) => {
        DISTROY_AUTH();
        SET_ERROR(error);
      })
      .finally(() => { });
  };
  const logout = async () => {
    authError.value = undefined;
    await useAppFetch<string>()
      .logoutEvent()
      .then((response) => {
        // DISTROY_TOKEN();
      })
      .catch((error) => {
        SET_ERROR(error);
      })
      .finally(() => {
        DISTROY_AUTH();
        window.location.reload();
      });
  };
  const update = async (formData: FormData) => {
    authError.value = undefined;
    await useAppFetch<AuthResponse>()
      .updateEvent(formData)
      .then((response) => {
        SET_AUTH(response);
      })
      .catch((error) => {
        SET_ERROR(error);
      })
      .finally(() => { });
  };
  const completeData = async (formData: FormData) => {
    authError.value = undefined;
    await useAppFetch<AuthResponse>().eventCompleteData(formData).then((response) => {
      SET_AUTH(response);
    }).catch((error) => {
      SET_ERROR(error);
    })
  }

  const changePassword = async (formData: FormData) => {
    authError.value = undefined

    isPasswordChange.value = false
    await useAppFetch<AuthResponse>().changePassword(formData).then((response) => {

      isPasswordChange.value = true
      notify({
        type: 'success',
        title: response.meta.message

      })
    }).catch((error) => {
      SET_ERROR(error)
    }).finally(() => {

    })
  }

  return {
    userType,
    user,
    isLoggedIn,
    token,
    authError,
    resetPasswordSuccessMessage,
    isPasswordChange,
    DISTROY_AUTH,
    SET_AUTH,
    enter,
    profile,
    login,
    loginWithSocial,
    register,
    logout,

    update,
    changePassword,
    resetPassword,
    completeData
    // // updateProfile,
  };
});
