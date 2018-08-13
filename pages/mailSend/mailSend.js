/*
 * @Author: tinniehe 
 * @Date: 2018-08-10 11:19:19 
 * @Last Modified by: tinniehe
 * @Last Modified time: 2018-08-13 13:06:54
 */
import {
  $wuxToast,
  $wuxBackdrop
} from '../../components/index'
import regeneratorRuntime from '../../libs/regenerator-runtime'

const GET_SEND_MAIL_URL = "http://193.112.91.187/yoyou/public/index.php/index/index/get_all_send_mail"
const APPEND_MOOD_URL = "http://193.112.91.187/yoyou/public/index.php/index/index/append_mail"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    user: {},
    in: false,
    edit_mail_id: '',
    edit_mood: ''
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
    if (this.data.user.user_id) {
      let opt = {
        url: GET_SEND_MAIL_URL,
        data: {
          data: {
            user_id: this.data.user.user_id
          }
        }
      }
      let list = await this.requestApi(opt)
      console.log(this.data)
      if (+list.errno === 0) {
        list = list.data
        list['arrived_unread_mail'].forEach((el, i, arr) => {
          arr[i].arrived_text = '已送达 等待开启'
          arr[i].arrived = 2
        });
        list['unarrived_mail'].forEach((el, i, arr) => {
          arr[i].arrived_text = '寄送中'
          arr[i].arrived = 0
        });
        list['arrived_read_mail'].forEach((el, i, arr) => {
          arr[i].arrived_text = '已送达'
          arr[i].arrived = 1
        });
        
        list = list['arrived_unread_mail'].concat(list['unarrived_mail'],list['arrived_read_mail'])
        if (list.length) {  
          list.map((item, i, input) => {
            let date = new Date(item.create_time * 1000)
            input[i].create_time = date.format('yyyy.MM.dd')
          })
          this.setData({
            list
          })
        }
      }

    }
  },
  onReady() {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop', this)
  },
  requestApi(opt) {
    let that = this
    return new Promise((resolve, reject) => {
      wx.request({
        ...opt,
        success(data) {
          let res = data.data
          if (res.errno !== 0) {
            $wuxToast().show({
              type: 'cancel',
              duration: 1500,
              color: '#fff',
              text: '出错啦'
            })
          }
          resolve(res)
        },
        fail() {
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
      })
    })
    
  },
  showAddMood(e) {
    this.setData({ 
      in: true,
      edit_mail_id: e.currentTarget.dataset.id,
      edit_mail_index: e.currentTarget.dataset.index,
      edit_mood: e.currentTarget.dataset.mood
    })
    this.$wuxBackdrop.retain()
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
          mail_id: this.data.edit_mail_id,
          mood: value.mood
        }
      }
    }
    let res = await this.requestApi(opt)
    if (+res.errno === 0) {
      let list = this.data.list
      list[this.data.edit_mail_index].mood = value.mood
      this.setData({
        list,
        in: false
      })
      console.log(this.data)
      this.$wuxBackdrop.release()
    }
  },
  formReset(event) {
    this.setData({ 
      in: false
    })
    this.$wuxBackdrop.release()
  },
  gotoMail(e) {
    let mail_id = e.currentTarget.dataset.id
    let arrived = e.currentTarget.dataset.arrived
    wx.navigateTo({
      url: `../mail/mail?type=send&mail_id=${mail_id}&arrived=${arrived}`
    })
  }
})