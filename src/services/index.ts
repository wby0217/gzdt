import { REACT_APPAPI_GATEWAY, REACT_APPAPI_GATALOG, REACT_APP_USER_WEB_URL } from '../utils/core';
import {
  AuthApi,
  ResourceApi,
  ResourceUploadApi,
  EntityTypesTreeApi,
  EngineInstanceApi,
  ResourceEnginesApi,
  EnumTypesApi,
  DomainApi,
  TagApi,
  TagResourceTreeApi,
  DomainMemberApi,
  Configuration,
  ResourcePropertyApi,
  ResourceIndexApi,
  ResourceIndexesApi,
  DomainEngineInstanceApi,
  ScopeApi,
  TypesApi,
  ResourceRelationshipApi,
  ResourcePartitionApi,
  ResourcePermissionApi,
  ResourceApplicationApi,
  ResourceDatasApi,
  ExtensionApi,
  FileApi,
  AccountApi,
  ApplicationApi,
  AuthAppCsDomainApi,
  ViewApi,
  ViewNodeApi,
  ProcessApi,
} from './client-ts-axios';
import { Toast } from 'antd-mobile';
import { ApiClient } from './ApiClient';
import { Domain } from 'domain';
import Axios, { AxiosPromise, AxiosInstance } from 'axios';
import { BaseAPI } from './client-ts-axios/base';

const configuration = {
  accessToken: () => {
    return ApiServices.getApiServiceToken();
  },
};

const basePath = REACT_APPAPI_GATALOG + '/datahub';

export const axiosInstance = Axios.create({
  timeout: 20000,
});
axiosInstance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    console.log(response);
    if (response.status === 204) {
      return response;
    } else {
      return response.data ? response.data : 'success';
    }
  },
  (error) => {
    // TODO 确认错误返回格式
    // {"errorString":"未授权","returnCode":38403,"result":[{"errorCode":"AuthorizationException","message":"访问网关服务异常[message :'{\"code\":403,\"message\":\"无效的用户名和密码\",\"data\":null}', url: 'http://192.168.153.44:9002/']。"}]}
    console.log(error.response);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (window.location.href.indexOf('/login') < 0) {
            // 授权中心登录地址
            window.location.href = REACT_APPAPI_GATALOG + '/auth/oauth/authorize?response_type=code&client_id=datahub-admin-console&redirect_uri=' +
  REACT_APPAPI_GATALOG +
  '/datahub-admin-console/';
          }
          break;
        default:
          let errorDesc = '';
          if (error.response.data.result && error.response.data.result.fieldErrors) {
            const fieldErrors = error.response.data.result.fieldErrors;
            // eslint-disable-next-line guard-for-in
            for (let key in fieldErrors) {
              const fieldError = fieldErrors[key];
              let tmpErrMsg = `${key}：`;
              for (let i = 0; i < fieldError.length; i++) {
                tmpErrMsg += fieldError[i].message + '；';
              }
              errorDesc += tmpErrMsg + '\n';
            }
          }
          if (error.response.data.result && error.response.data.result[0]) {
            errorDesc = error.response.data.result[0].message;
          }
          Toast.fail({
            message: errorDesc ? errorDesc : '系统错误！',
            // description: errorDesc,
          });
          break;
      }
    } else {
      Toast.fail({ message: '网络连接失败，请稍后再试！' });
    }
  }
);

const gdocAxiosInstance = Axios.create({});
gdocAxiosInstance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    console.log(response);
    if (response.status === 204) {
      return response;
    } else {
      return response.data ? response.data : 'success';
    }
  },
  (error) => {
    console.log(error.response);
    if (error.response) {
      switch (error.response.status) {
        case 500:
        case 403:
        case 400:
          Toast.fail({
            message: error.response.data.message,
          });
          break;
        default:
          return error.response;
      }
    } else {
      Toast.fail({ message: '网络连接失败，请稍后再试！' });
    }
  }
);
interface GdocResponseBody {
  code: number;
  message: string;
  data: any;
}

class GdocApi {
  uploadFileByOperationCode(operationCode: string, file: any): AxiosPromise<any> {
    console.log(file);
    const formData = new FormData();
    formData.append('file', file);
    return gdocAxiosInstance
      .post(`https://api.glodon.com/gdoc/v4/insecure/operationCode/files?operationCode=${operationCode}`, formData, {
        headers: {
          'Content-type': 'multipart/form-data;',
        },
      })
      .then((res) => {
        return res;
      });
  }
}

export const gdocApi = new GdocApi();

export class ApiServices {
  public static securityToken: string;
  public authApi: AuthApi;
  public authAppDomainApi: AuthAppCsDomainApi;
  // public authUrlPatternApi: AuthUrlPatternApi;
  public accountApi: AccountApi;
  public applicationApi: ApplicationApi;
  public enumTypesApi: EnumTypesApi;
  public typesApi: TypesApi;
  public resourceApi: ResourceApi;
  public resourceUploadApi: ResourceUploadApi;
  public resourcePropertyApi: ResourcePropertyApi;
  public resourceIndexApi: ResourceIndexApi;
  public resourceIndexesApi: ResourceIndexesApi;
  public resourceRelationshipApi: ResourceRelationshipApi;
  public resourcePartitionApi: ResourcePartitionApi;
  public processApi: ProcessApi;
  public entityTypesApi: EntityTypesTreeApi;
  public domainApi: DomainApi;
  public domainEngineInstanceApi: DomainEngineInstanceApi;
  public domainMemberApi: DomainMemberApi;
  public resourceEngineInstanceApi: EngineInstanceApi;
  public resourceEngineApi: ResourceEnginesApi;
  public resourcePermissionApi: ResourcePermissionApi;
  public resourceApplicationApi: ResourceApplicationApi;
  public resourceDatasApi: ResourceDatasApi;
  public tagApi: TagApi;
  public tagResourceTreeApi: TagResourceTreeApi;
  public scopeApi: ScopeApi;
  public fileApi: FileApi;
  public viewApi: ViewApi;
  public viewNodeApi: ViewNodeApi;
  public extensionApi: ExtensionApi;

  constructor(private configuration?: Configuration, private basePath?: string, private axiosInstance?: AxiosInstance) {
    this.authApi = new AuthApi(configuration, basePath, axiosInstance);
    this.accountApi = new AccountApi(configuration, basePath, axiosInstance);
    this.applicationApi = new ApplicationApi(configuration, basePath, axiosInstance);
    this.authAppDomainApi = new AuthAppCsDomainApi(configuration, basePath, axiosInstance);
    // this.authUrlPatternApi = new AuthUrlPatternApi(configuration, basePath, axiosInstance);
    this.typesApi = new TypesApi(configuration, basePath, axiosInstance);
    this.resourceApi = new ResourceApi(configuration, basePath, axiosInstance);
    this.resourceUploadApi = new ResourceUploadApi(configuration, basePath, axiosInstance);
    this.resourcePropertyApi = new ResourcePropertyApi(configuration, basePath, axiosInstance);
    this.resourceIndexApi = new ResourceIndexApi(configuration, basePath, axiosInstance);
    this.resourceIndexesApi = new ResourceIndexesApi(configuration, basePath, axiosInstance);
    this.resourceRelationshipApi = new ResourceRelationshipApi(configuration, basePath, axiosInstance);
    this.resourcePartitionApi = new ResourcePartitionApi(configuration, basePath, axiosInstance);
    this.processApi = new ProcessApi(configuration, basePath, axiosInstance);
    this.entityTypesApi = new EntityTypesTreeApi(configuration, basePath, axiosInstance);
    this.domainApi = new DomainApi(configuration, basePath, axiosInstance);
    this.domainMemberApi = new DomainMemberApi(configuration, basePath, axiosInstance);
    this.domainEngineInstanceApi = new DomainEngineInstanceApi(configuration, basePath, axiosInstance);
    this.resourceEngineApi = new ResourceEnginesApi(configuration, basePath, axiosInstance);
    this.resourceEngineInstanceApi = new EngineInstanceApi(configuration, basePath, axiosInstance);
    this.resourcePermissionApi = new ResourcePermissionApi(configuration, basePath, axiosInstance);
    this.resourceApplicationApi = new ResourceApplicationApi(configuration, basePath, axiosInstance);
    this.resourceDatasApi = new ResourceDatasApi(configuration, basePath, axiosInstance);
    this.enumTypesApi = new EnumTypesApi(configuration, basePath, axiosInstance);
    this.tagApi = new TagApi(configuration, basePath, axiosInstance);
    this.tagResourceTreeApi = new TagResourceTreeApi(configuration, basePath, axiosInstance);
    this.scopeApi = new ScopeApi(configuration, basePath, axiosInstance);
    this.fileApi = new FileApi(configuration, basePath, axiosInstance);
    this.viewApi = new ViewApi(configuration, basePath, axiosInstance);
    this.viewNodeApi = new ViewNodeApi(configuration, basePath, axiosInstance);

    this.extensionApi = new ExtensionApi(configuration, basePath, axiosInstance);
  }

  public static getApiServiceToken() {
    return ApiServices.securityToken;
  }
  public setApiServiceToken(token) {
    // TO delete
    // token =
    //   'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJpc3MiOiJwZGMtYXBpIiwic3ViIjoiaW50ZXJuYWxAbG9jYWwiLCJyb2wiOlsiQURNSU4iLCJVU0VSIl19.19R1zztvjXERk02FIQ7hPmDgkjxKLuxcyGUUpZidyp7gdBdqW_NLlk33ckXrapctIQysiDicB_BHnYJ26Ax02Q';
    ApiServices.securityToken = token;
  }
}

export const apiServices = new ApiServices(configuration, basePath, axiosInstance);

export const dataServices = {
  // fetch info of specific model
  async fetchViewNodeData(url, pageNo?, pageSize?) {
    const dataserver = new ApiClient(`${REACT_APPAPI_GATEWAY}`, 'Bearer ' + ApiServices.getApiServiceToken());
    const requestResult = await dataserver.get(url, { pageNo: pageNo, pageSize: pageSize });
    console.log(requestResult);
    return requestResult as any;
  },
};
