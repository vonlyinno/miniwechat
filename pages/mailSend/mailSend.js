/*
 * @Author: tinniehe 
 * @Date: 2018-08-10 11:19:19 
 * @Last Modified by: tinniehe
 * @Last Modified time: 2018-08-12 00:47:55
 */
import {
  $wuxToast,
  $wuxBackdrop
} from '../../components/index'
import regeneratorRuntime from '../../libs/regenerator-runtime'

const GET_SEND_MAIL_URL = "//193.112.91.187/manji/public/index.php/index/index/get_all_send_email"
const APPEND_MOOD_URL = "//193.112.91.187/manji/public/index.php/index/index/append_mail"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    user: {},
    in: false,
    edit_mail_id: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    const app = getApp()
    this.setData({
      user: {
        open_id: app.data.openid || '',
        user_id: app.data.userid || '',
        avator: app.data.picUrl || '',
        nick_name: app.data.nickName || 'who are you'
      }
    })
    if (!this.data.user.user_id) {
      let opt = {
        url: GET_SEND_MAIL_URL,
        data: {
          //user_id: this.data.user.user_id
        }
      }
      //let list= await this.requestApi(opt)
      let list = {
        "errno": 0,
        "data": {
          "arrived_unread_mail": [],
          "unarrived_mail": [{
            "mail_id": "1",
            "user_id": "1",
            "poster_url": "http://f12.baidu.com/it/u=752933719,2910359121&fm=72",
            "friend_name": "何娇羞",
            "friend_addr": "深圳",
            "friend_email": "tutu@qq.com",
            "arrived_time": "",
            "poster_status": "信使在北京迷路拉",
            "create_time": "2018.08.06",
            "mood": "",
            "poster_desc": "月达",
            "is_read": "0"
          }],
          "arrived_mail": [{
            "mail_id": "1",
            "user_id": "1",
            "poster_url": "http://f12.baidu.com/it/u=752933719,2910359121&fm=72",
            "friend_name": "何娇羞",
            "friend_addr": "深圳",
            "friend_email": "tutu@qq.com",
            "arrived_time": "2018.08.20 15:21:22",
            "poster_status": "信使在北京迷路拉",
            "create_time": "2018.08.06 15:12:13",
            "mood": "",
            "poster_desc": "月达",
            "is_read": "0"
          }]
        }
      }
      if (+list.errno === 0) {
        list = list.data
        list['arrived_unread_mail'].forEach((el, i, arr) => {
          arr[i].arrived_text = '已送达 等待开启'
          arr[i].arrived = 2
        });
        list['unarrived_mail'].forEach((el, i, arr) => {
          arr[i].arrived_text = '寄送中'
          arr[i].arrived= 0
        });
        list['arrived_mail'].forEach((el, i, arr) => {
          arr[i].arrived_text = '已送达'
          arr[i].arrived = 1
        });
        if (list) {
          this.setData({
            list: list['arrived_unread_mail'].concat(list['unarrived_mail'].concat(list['arrived_mail']))
          })
        }
      }

    }
  },
  onReady() {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop', this)
  },
  showAddMood(mail_id = '', index = '') {
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
        text: '出错啦',
        success() {
          wx.navigateBack()
        }
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
    this.setData({ in: false
    })
    this.$wuxBackdrop.release()
  }
})