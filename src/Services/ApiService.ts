import Firebase from "firebase/auth";
import { getJWTToken } from "./FirebaseService";
import config from "../config";
import { plainToInstance } from "class-transformer";
// import UserStore from "../localforage/UserStore";
import { ApiMethodEnum } from "../Enums/ApiMethodEnum";
import HydraError from "../Models/HydraError";
import { BusinessError, ServerError } from "../Models/Exception";
import User from "../Models/User";
import localforage from "localforage";

export default abstract class ApiService {
  private static requestHeaders: any = {};
  private static fetchSettings: any = {};

  private static userType?: string;
  private static isLoggedIn: boolean = false;
  private static userAuth?: Firebase.User | undefined | null;

  private static cachedApiCalls: any = {};

  /**
   * Enable auth requests.
   * It means that all future requests will add Authorization header.
   * @param user
   * @param userFirebase
   * @param specifiedToken
   */
  public static enableAuth(
    user: User | undefined,
    userFirebase: Firebase.User | undefined,
    specifiedToken: string | undefined
  ) {
    if (userFirebase) {
      ApiService.isLoggedIn = true;
      // if (user?.role === "Client") {
      //   ApiService.userType = "client";
      // } else if (user?.role === "Employee") {
      //   ApiService.userType = "employee";
      // } else if (user?.role === "Admin") {
      //   ApiService.userType = "admin";
      // }
    } else if (specifiedToken) {
      ApiService.isLoggedIn = true;
      ApiService.userType = specifiedToken;
      localforage.setItem("authorization", ApiService.userType);
    } else {
      throw new Error(
        "ERROR... You must specify user and userFirebase or at least specifiedToken"
      );
    }
  }

  /**
   * Disable auth requests.
   * It means that secured routes won't be accessible anymore.
   */
  public static disableAuth() {
    ApiService.userType = undefined;
    ApiService.userAuth = undefined;
    ApiService.isLoggedIn = false;
    localforage.removeItem("authorization");
  }

  /**
   * Returns current valid token for the user
   */
  public static async getValidJWTToken() {
    if (ApiService.userAuth) {
      let token: string = await getJWTToken(ApiService.userAuth);

      return ApiService.userType + " " + token;
    } else {
      // @ts-ignore

      return ApiService.userType;
    }
  }

  /**
   * Fetch a single instance by making a GET request
   * @param url
   * @param classType
   * @param isHydraEntity
   */
  public static getSingleInstance<T>(
    url: string,
    classType: any,
    isHydraEntity: boolean = true
  ) {
    return ApiService.callGlobal<T>(
      url,
      classType,
      false,
      ApiMethodEnum.GET,
      null,
      isHydraEntity
    );
  }

  /**
   * Post an instance of a the object by making a POST request
   * @param url
   * @param classType
   * @param body
   * @param isHydraEntity
   * @param isFileUpload
   */
  public static postInstance<T>(
    url: string,
    classType: any,
    body: any,
    isHydraEntity: boolean = true,
    isFileUpload = false
  ) {
    return ApiService.callGlobal<T>(
      url,
      classType,
      false,
      ApiMethodEnum.POST,
      body,
      isHydraEntity,
      1,
      isFileUpload
    );
  }
  /**
   * Deletes an instance by making a DELETE request
   * @param url
   */
  public static deleteInstance(url: string) {
    return ApiService.callGlobal<boolean>(
      url,
      null,
      false,
      ApiMethodEnum.DELETE,
      null
    );
  }

  /**
   * Put an instance of the object by making a PUT request
   * @param url
   * @param classType
   * @param body
   * @param isHydraEntity
   */
  public static putInstance<T>(
    url: string,
    classType: any = null,
    body: any = null,
    isHydraEntity: boolean = true
  ) {
    return ApiService.callGlobal<T>(
      url,
      classType,
      false,
      ApiMethodEnum.PUT,
      body,
      isHydraEntity
    );
  }

  /**
   * Get query string
   * copy/pasted from https://stackoverflow.com/a/53536230/1185460
   */
  private static querystring(query = {}): string {
    // get array of key value pairs ([[k1, v1], [k2, v2]])
    const qs = Object.entries(query)
      // filter pairs with undefined value
      .filter((pair) => pair[1] !== undefined)
      // encode keys and values, remove the value if it is null, but leave the key
      .map((pair) =>
        pair
          .filter((i) => i !== null)
          //@ts-ignore
          .map(encodeURIComponent)
          .join("=")
      )
      .join("&");

    return qs && "?" + qs;
  }

  /**
   * Make call request to the Teach'r API.
   * @param url
   * @param classType
   * @param isCollection
   * @param httpMethod
   * @param body
   * @param isHydraEntity
   * @param collectionPage
   * @param isFileUpload
   * @param filters
   * @throws Error
   * @throws HydraError
   */
  private static async callGlobal<T>(
    url: string,
    classType: any,
    isCollection: boolean,
    httpMethod: ApiMethodEnum,
    body: any = null,
    isHydraEntity: boolean = true,
    collectionPage: number = 1,
    isFileUpload: boolean = false,
    filters: Array<string> | null = null
  ): Promise<T> {
    if (!isFileUpload) {
      ApiService.requestHeaders = {
        "Content-Type": "application/ld+json",
        Accept: "application/ld+json",
      };
    } else {
      // file upload
      ApiService.requestHeaders = {};
    }

    const userResponse: any = await localforage.getItem("authorization");
    localforage.config({
      name: "firebaselocalforageDb",
      storeName: "firebaselocalforage",
    });
    const userFirebaseResponse: any = await localforage.getItem(
      `firebase:authUser:${config.firebase.apiKey}:[DEFAULT]`
    );

    if (userResponse) {
      const userType = userResponse.split(" ")[0];
      if (userFirebaseResponse) {
        if (
          userResponse.search(
            userFirebaseResponse.value.stsTokenManager.accessToken
          ) > -1
        ) {
          ApiService.userType = userResponse;
        } else {
          ApiService.userType = `${userType} ${userFirebaseResponse.value.stsTokenManager.accessToken}`;
        }
      } else {
        ApiService.userType = userResponse;
      }
      ApiService.isLoggedIn = true;
    }

    if (ApiService.userType !== undefined) {
      ApiService.requestHeaders["Authorization"] =
        await ApiService.getValidJWTToken();
    }
    // Add the API version
    // ApiService.requestHeaders["X-Accept-Version"] = config.apiVersion;
    // ApiService.requestHeaders["X-App-Version"] = config.appVersion;

    ApiService.fetchSettings = {
      method: httpMethod,
      headers: ApiService.requestHeaders,
    };

    if (body !== null) {
      if (isFileUpload) {
        let formdata = new FormData();
        formdata.append("file", body);
        ApiService.fetchSettings.body = formdata;
      } else {
        Object.keys(body).forEach(
          (key) => body[key] == null && delete body[key]
        );
        ApiService.fetchSettings.body = JSON.stringify(body);
      }
    }
    if (isCollection) {
      if (filters === null) {
        filters = new Array<string>(); // we initialize the array is required
      }
      // we add the page number
      if (collectionPage !== 0) {
        filters.push("page=" + collectionPage);
      }
    }
    if (filters !== null) {
      // there is some url parameters to add
      url += "?" + filters.join("&");
    }

    return fetch(config.uriPath + url, ApiService.fetchSettings)
      .then((response: Response) => {
        // for DELETE request
        if (response.status === 204 && httpMethod === ApiMethodEnum.DELETE) {
          return true;
        }
        if (httpMethod === ApiMethodEnum.DELETE) {
          return false;
        }

        const contentType = response.headers.get("content-type");
        if (
          contentType &&
          (contentType.indexOf("application/ld+json") !== -1 ||
            contentType.indexOf("application/json") !== -1 ||
            contentType.indexOf("application/problem+json") !== -1)
        ) {
          // it's JSON
          return response.json();
        } else {
          // it's not JSON
          response.text().then(function (text) {
            // console.warn(text);
          });
          throw new HydraError(
            "Fatal error while making request to the API",
            "unknown"
          );
        }
      })
      .then((data) => {
        // it may happen for GET /address/default/
        // when there's no default address yet
        if (data === null) {
          return data;
        }
        // for DELETE request
        if (typeof data === "boolean") {
          return data;
        }
        // it's JSON
        if (data["@context"] === "/contexts/Error") {
          throw new HydraError(data["hydra:title"], data["hydra:description"]);
        }
        if (data["@context"] === "/contexts/ConstraintViolationList") {
          let error = new HydraError(
            data["hydra:title"],
            "Constraint violation"
          );
          if (data.violations != null) {
            data.violations.forEach((violation: any) => {
              error.addInvalidAttribute(
                violation.propertyPath,
                violation.message
              );
            });
          }
          throw error;
        } else if (classType != null && data["@context"] != null) {
          // It's good content
          data = plainToInstance(classType, data);
          return data;
        } else if (classType === null && !isHydraEntity) {
          // simple JSON with no ld
          return data;

          // It's not an HydraError but we consider it as one
        } else if (data.message != null) {
          throw new HydraError("Error", data.message);
        } else {
          if (JSON.stringify(data)) {
            return data;
          } else {
            throw new HydraError(
              "Fatal error while making request to the API",
              "unknown"
            );
          }
        }
      })
      .catch((error) => {
        // console.warn(error);
        throw error;
      });
  }

  /**
   *
   */
  public static async get(
    path: string,
    queryParams = {},
    forcedHeaders = {}
  ): Promise<any> {
    //@ts-ignore
    return ApiService.memoizedCommonCall(
      ApiMethodEnum.GET,
      path + ApiService.querystring(queryParams),
      null, // no body
      forcedHeaders
    );
  }

  /**
   * Note: we can't name it delete because it's a reserved keyword...
   */
  public static async xdelete(
    path: string,
    queryParams = {},
    forcedHeaders = {}
  ) {
    return ApiService.memoizedCommonCall(
      ApiMethodEnum.DELETE,
      path + ApiService.querystring(queryParams),
      null, // no body
      forcedHeaders
    );
  }

  /**
   *
   */
  public static async post(
    path: string,
    body: Object | null = null,
    forcedHeaders = {}
  ) {
    return ApiService.memoizedCommonCall(
      ApiMethodEnum.POST,
      path,
      body,
      forcedHeaders
    );
  }

  /**
   *
   */
  public static async put(
    path: string,
    body: Object | null = null,
    forcedHeaders = {}
  ) {
    return ApiService.memoizedCommonCall(
      ApiMethodEnum.PUT,
      path,
      body,
      forcedHeaders
    );
  }

  /**
   *
   */
  private static memoizedCommonCall(
    httpMethod: ApiMethodEnum,
    path: string,
    body: Object | null = null,
    forcedHeaders = {}
  ) {
    return new Promise(async (resolve, reject) => {
      let data;
      let promiseCallAt = Date.now();

      const promiseKey =
        httpMethod +
        " " +
        path +
        " " +
        JSON.stringify(body) +
        " " +
        JSON.stringify(forcedHeaders);

      const cachedCall = ApiService.cachedApiCalls[promiseKey];
      if (cachedCall !== undefined) {
        // we consider a API call to be cache-able 5 seconds
        // for longer cache, please use other standard mechanism
        if (promiseCallAt - cachedCall.promiseFirstCallAt < 5000) {
          let data = await cachedCall.promise;
          resolve(data);
          return;
        }

        // the data was in the cache, but stalled, so we delete it
        delete ApiService.cachedApiCalls[promiseKey];
      }

      try {
        let promise = ApiService.commonCall(
          httpMethod,
          path,
          //@ts-ignore
          body,
          forcedHeaders
        );

        ApiService.cachedApiCalls[promiseKey] = {
          promise,
          promiseFirstCallAt: promiseCallAt,
        };
        data = await promise;
      } catch (e) {
        reject(e);
        return;
      }

      resolve(data);
    });
  }

  /**
   *
   */
  private static async commonCall(
    httpMethod: ApiMethodEnum,
    path: string,
    body = null,
    forcedHeaders = {}
  ) {
    // step 1:  we init the HTTP headers
    let headers = {
      // "X-App-Version": config.appVersion,
      // "X-Accept-Version": config.apiVersion,
      "Content-Type": "application/json",
      // can be used to force a new content type etc.
      ...forcedHeaders,
    };

    const FirebaseStore =  localforage.createInstance({
      name: 'firebaseLocalStorageDb',
      storeName: 'firebaseLocalStorage'
  });
    
    const userResponse: any = await localforage.getItem("authorization");
    const userFirebaseResponse: any = await FirebaseStore.getItem(
      `firebase:authUser:${config.firebase.apiKey}:[DEFAULT]`
    );
    if (userResponse) {
      const userType = userResponse.split(" ")[0];
      if (userFirebaseResponse) {
        if (
          userResponse.search(
            userFirebaseResponse.value.stsTokenManager.accessToken
          ) > -1
        ) {
          ApiService.userType = userResponse;
        } else {
          ApiService.userType = `${userType} ${userFirebaseResponse.value.stsTokenManager.accessToken}`;
        }
      } else {
        ApiService.userType = userResponse;
      }
      ApiService.isLoggedIn = true;
    }

    if (ApiService.userType !== undefined) {
      //@ts-ignore
      headers["Authorization"] = await ApiService.getValidJWTToken();
    }

    // if (ApiService.isLoggedIn) {
    //     //@ts-ignore

    //     headers["Authorization"] = await ApiService.getValidJWTToken();

    // }

    // step 2 we create the dict used by fetch
    // and we stringify the body is any
    let fetchSettings = {
      method: httpMethod,
      headers: headers,
    };

    if (body !== null) {
      //@ts-ignore
      fetchSettings.body = JSON.stringify(body);
    }

    // step 3, we do the fetch call, and directly
    // throw in case of network error
    let response;
    try {
      response = await fetch(config.uriPath + path, fetchSettings);
    } catch (e) {
      // it's very certainly a network error
      // console.warn(e);
      throw e;
    }

    // step 4 we get the body, we try to get it
    // as json, but default to text otherwise
    let data;
    if (response.headers.get("content-type")?.includes("json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    // step 5 we handle server errors
    if (response.status >= 500) {
      throw new ServerError(data);
    } else if (response.status >= 400) {
      throw new BusinessError(data);
    }

    // step 6, happy path, it's 20X, we give back the data
    return data;
  }

  /**
   * Fetch a collection by making a GET request
   * @param url
   * @param classType
   * @param isHydraEntity
   * @param page
   * @param filters
   */
  public static getCollection<T>(
    url: string,
    classType: any,
    isHydraEntity: boolean = true,
    page: number,
    filters?: Array<string> | null
  ) {
    return ApiService.callGlobal<T>(
      url,
      classType,
      true,
      ApiMethodEnum.GET,
      null,
      isHydraEntity,
      page,
      false,
      filters
    );
  }
}
