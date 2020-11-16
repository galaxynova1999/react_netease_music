import axios from 'axios';
import {createInfo,createError} from '../component/notification/Notification';
import { LogOut } from "../api/Login";

const request = axios.create({
  baseURL:"http://localhost:3000",
  withCredentials:true,
  timeout:10000,
})

request.interceptors.response.use(
    response => {
      if (response.status === 200) {
        return Promise.resolve(response);
      } else {
        return Promise.reject(response);
      }
    },
    // 服务器状态码不是200的情况
    error => {
      if (error.response.status) {
        switch (error.response.status) {
          case 400 : {
            createError('请检查参数');
            break;
          }
            // 401: 未登录
          case 401: {
            createError('未登录！');
            break;
          }
            // 403 token过期
            // 登录过期对用户进行提示
          case 403: {
            createInfo('登录过期，请重新登录');
            LogOut();
            break;
          }
          case 404: {
            createError('抱歉，出现404了');
            break;
          }
            // 其他错误，直接抛出错误提示
          default: {
            createError(error.response.data.msg || error.response.data.message);
            break;
          }
        }
        return Promise.reject(error.response);
      }
    }
)
export function post(url,params) {
  return new Promise((resolve, reject) => {
    request.post(url, params)
        .then(res => {
          resolve(res);
        })
        .catch(err =>{
          reject(err)
        })
  });
}
export function get(url,params) {
  return new Promise((resolve, reject) => {
    request.get(url, {
       params:{
           ...params
       }
    })
        .then(res => {
          resolve(res);
        })
        .catch(err =>{
          reject(err)
        })
  });
}
