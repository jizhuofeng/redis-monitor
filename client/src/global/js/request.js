/*
 * request.js 公共请求函数集
 * */

import request from 'superagent';
import { notification } from 'antd';
/*
 * GET request method
 * reqObj{
 *   context - 方法调用上下文环境(this)
 *   init - 是否只调用一次(初始化
 * }
 * */
export function Glo_getRequest(reqObj) {
  let tempState = Object.assign({}, reqObj.context.state);
  if (reqObj.init && !tempState[reqObj.url + 'init'] || !reqObj.init) {
    let reqTime = 1;
    if (tempState[reqObj.url + '_reqTime']) {
      reqTime = ++tempState[reqObj.url + '_reqTime'];
    } else {
      tempState[reqObj.url + '_reqTime'] = reqTime;
    }
    if (reqObj.init && !tempState[reqObj.url + 'init']) {
      tempState[reqObj.url + 'init'] = true;
    }
    reqObj.context.setState(tempState, () => {
      request.get(reqObj.url).query(reqObj.data).end((err, res) => {
        if (res.status === 200) {
          if (reqTime === reqObj.context.state[reqObj.url + '_reqTime']) {
            reqObj.response.call(reqObj.context, err, res);
          }
        } else {
          notification['warning']({
            message: '对不起,系统升级中',
            description: '如果系统长时间处于升级状态,请联系工程师们为您解决问题。',
            duration: 7
          });
        }
      });
    });
  }
}

/**
 * PUT request method
 * reqObj {
 *    context - 方法调用上下文环境(this)
 *    init - 是否只调用一次(初始化
 * }
 */
export function Glo_putRequest(reqObj) {
  let tempState = Object.assign({}, reqObj.context.state);
  if (reqObj.init && !tempState[reqObj.url + 'init'] || !reqObj.init) {
    if (reqObj.init && !tempState[reqObj.url + 'init']) {
      tempState[reqObj.url + 'init'] = true;
      reqObj.context.setState(tempState);
    }
    request.put(reqObj.url).send(reqObj.data).end((err, res) => {
      if (res.status === 200) {
        reqObj.response.call(reqObj.context, err, res);
      } else {
        notification['warning']({
          message: '对不起,系统升级中',
          description: '如果系统长时间处于升级状态,请联系工程师们为您解决问题。',
          duration: 7
        });
      }
    });
  }
}

/*
 * POST request method
 * reqObj{
 *   context - 方法调用上下文环境(this)
 *   init - 是否只调用一次(初始化
 * }
 * */
export function Glo_postRequest(reqObj) {
  let tempState = Object.assign({}, reqObj.context.state);
  if (reqObj.init && !tempState[reqObj.url + 'init'] || !reqObj.init) {
    if (reqObj.init && !tempState[reqObj.url + 'init']) {
      tempState[reqObj.url + 'init'] = true;
      reqObj.context.setState(tempState);
    }
    request.post(reqObj.url).send(reqObj.data).end((err, res) => {
      if (res.status === 200) {
        reqObj.response.call(reqObj.context, err, res);
      } else {
        notification['warning']({
          message: '对不起,系统升级中',
          description: '如果系统长时间处于升级状态,请联系工程师们为您解决问题。',
          duration: 7
        });
      }
    });
  }
}

/*
 * PATCH request method
 * reqObj{
 *   context - 方法调用上下文环境(this)
 *   init - 是否只调用一次(初始化
 * }
 * */
export function Glo_patchRequest(reqObj) {
  let tempState = Object.assign({}, reqObj.context.state);
  if (reqObj.init && !tempState[reqObj.url + 'init'] || !reqObj.init) {
    if (reqObj.init && !tempState[reqObj.url + 'init']) {
      tempState[reqObj.url + 'init'] = true;
      reqObj.context.setState(tempState);
    }
    request.patch(reqObj.url).send(reqObj.data).end((err, res) => {
      if (res.status === 200) {
        reqObj.response.call(reqObj.context, err, res);
      } else {
        notification['warning']({
          message: '对不起,系统升级中',
          description: '如果系统长时间处于升级状态,请联系工程师们为您解决问题。',
          duration: 7
        });
      }
    });
  }
}

/*
 * DELETE request method
 * reqObj{
 *   context - 方法调用上下文环境(this)
 * }
 * */
export function Glo_deleteRequest(reqObj) {
  request.del(reqObj.url).send(reqObj.data).end((err, res) => {
    if (res.status === 200) {
      reqObj.response.call(reqObj.context, err, res);
    } else {
      notification['warning']({
        message: '对不起,系统升级中',
        description: '如果系统长时间处于升级状态,请联系工程师们为您解决问题。',
        duration: 7
      });
    }
  });
}