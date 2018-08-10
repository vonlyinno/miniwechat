/*
 * @Author: tinniehe 
 * @Date: 2018-08-10 11:19:19 
 * @Last Modified by: tinniehe
 * @Last Modified time: 2018-08-10 19:40:09
 */
import {
  $wuxToast,
  $wuxBackdrop
} from '../../components/index'
import regeneratorRuntime from '../../libs/regenerator-runtime'

const app = getApp()
const GET_SEND_MAIL_URL = "//193.112.91.187/manji/public/index.php/index/index/get_all_send_email"
const APPEND_MOOD_URL = "http://193.112.91.187/manji/public/index.php/index/index/append_mail"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    user: {
      open_id: app.data.openid || '',
      user_id: app.data.userid || '',
      avator: app.data.avator || '',
      nick_name: app.data.nick_name || 'who are you'
    },
    in: false,
    edit_mail_id: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    if (this.user_id) {
      let opt = {
        url: GET_SEND_MAIL_URL,
        data: {
          user_id: this.user.user_id
        }
      }
      let data = await this.requestApi(opt)
      if (+data.errno === 0) {
        list = data.data
        list['unarrived_mail'].forEach((el, i, arr) => {
          arr[i].arrived = 0
        });
        list['arrived_mail'].forEach((el, i, arr) => {
          arr[i].arrived = 1
        });
        if (list) {
          this.setData({
            list: list['unarrived_mail'].concat(list['arrived_mail'])
          })
        }
      }

    }
  },
  onReady() {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop', this)
  },
  showAddMood(mail_id='', index='') {
    this.setData({ in: true,
      edit_mail_id: mail_id,
      edit_mail_index: index
    })
    this.$wuxBackdrop.retain()
  },
  async requestApi(opt) {
    try {
      let res = await wx.request(opt)
      if (res.errno !== 0) {
        $wuxToast().show({
          type: 'cancel',
          duration: 1500,
          color: '#fff',
          text: '出错啦'
        })
      }
      return res
    } catch (err) {
      $wuxToast().show({
        type: 'cancel',
        duration: 1500,
        color: '#fff',
        text: '出错啦'
      })
    }
  },
  async formSubmit(event) {
    let value = event.detail.value

    if (typeof value.mood === 'undefined' || value.mood === '') {
      $wuxToast().show({
        type: 'text',
        duration: 1500,
        color: '#fff',
        text: '请输入你的心情',
      })
      return
    }
    let opt = {
      url: APPEND_MOOD_URL,
      data: {
        data: {
          mail_id: this.edit_mail_id,
          mood: value.mood
        }
      },
      method: 'POST'
    }
    let res = await this.requestApi(opt)
    if (+res.errno === 0) {
      this.setData({
        'list[this.edit_mail_index].mood': value.mood,
        in: false
      })
      this.$wuxBackdrop.release()
    }
  },
  formReset(event) {
    this.setData({ in: false })
    this.$wuxBackdrop.release()
  }
})