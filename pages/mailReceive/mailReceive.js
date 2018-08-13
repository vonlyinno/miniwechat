/*
 * @Author: tinniehe 
 * @Date: 2018-08-10 10:35:27 
 * @Last Modified by: tinniehe
 * @Last Modified time: 2018-08-13 13:43:57
 */
import { $wuxToast } from '../../components/index'
import regeneratorRuntime from '../../libs/regenerator-runtime'

const GET_RECEIVE_MAIL_URL = "http://193.112.91.187/yoyou/public/index.php/index/index/get_all_receive_mail"
Page({
  data: {
    list: [],
    user: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    const app = getApp()
    this.setData({
      user: {
        open_id: app.data.openid || '',
        user_id: app.data.userid || '',
        avator: app.data.picUrl || 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1534016080759&di=5578d267bb43ad31cfe8ad0419024eac&imgtype=0&src=http%3A%2F%2Fimg5.duitang.com%2Fuploads%2Fitem%2F201411%2F02%2F20141102115809_FavJH.thumb.700_0.jpeg',
        nick_name: app.data.nickName || 'who are you'
      }
    })
    if(this.data.user.user_id) {
      let opt = {
        url: GET_RECEIVE_MAIL_URL,
        data: {
         data: {
          user_id: this.data.user.user_id
         }
        }
      }
      let list = await this.requestApi(opt)
      if (list.errno === 0) {
        list = list.data
        //设置cover
        list.map((item, i, input) => {
          let content = JSON.parse(item.content)
          let cover = content.find((j) => {
            return j.type === 'image' && j.value
          })
          if (cover) {
            input[i].mail_cover = cover.value
          }else {
            input[i].mail_cover = 'http://193.112.91.187/yoyou/public/cover/cover.png'
          }
          //time
          let date = new Date(item.create_time * 1000)
          input[i].create_time = date.format('yyyy.MM.dd')
        })
        this.setData({
          list 
        })
      }
      
    }
  },
  requestApi(opt) {
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
          console.log(err)
          $wuxToast().show({
            type: 'cancel',
            duration: 1500,
            color: '#fff',
            text: '出错啦',
            success() {
              // wx.navigateBack()
            }
          })
        }
      })
    })
    
  },
})