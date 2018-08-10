/*
 * @Author: tinniehe 
 * @Date: 2018-08-10 10:35:27 
 * @Last Modified by: tinniehe
 * @Last Modified time: 2018-08-10 11:22:23
 */
import { $wuxToast } from '../../components/index'
import regeneratorRuntime from '../../libs/regenerator-runtime'

const app = getApp()
const GET_RECEIVE_MAIL_URL = "//193.112.91.187/manji/public/index.php/index/index/get_all_receive_mail"
Page({
  data: {
    list: [],
    user: {
      open_id: app.data.openid || '',
      user_id: app.data.userid || '',
      avator: app.data.avator || '',
      nick_name: app.data.nick_name || 'who are you'
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    if(this.user_id) {
      let opt = {
        url: GET_RECEIVE_MAIL_URL,
        data: {
          user_id: this.user.user_id
        }
      }
      let list = await this.requestApi(opt)
      if(list) {
        //设置cover
        list.map((item) => {

        })
        this.setData({
          list
        })
      }
    }
  },
  async requestApi (opt) {
    try {
      let res = await wx.request(opt)
      if(res.errno === 0){
        return res.data
      } else {
        $wuxToast().show({
          type: 'cancel',
          duration: 1500,
          color: '#fff',
          text: '出错啦'
        })
      }
    } catch (err) {
      $wuxToast().show({
        type: 'cancel',
        duration: 1500,
        color: '#fff',
        text: '出错啦'
      })
    }
  }
})