/*
 * @Author: tinniehe 
 * @Date: 2018-08-10 10:35:27 
 * @Last Modified by: tinniehe
 * @Last Modified time: 2018-08-12 13:37:02
 */
import { $wuxToast } from '../../components/index'
import regeneratorRuntime from '../../libs/regenerator-runtime'

const GET_RECEIVE_MAIL_URL = "//193.112.91.187/manji/public/index.php/index/index/get_all_receive_mail"
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
    if(!this.data.user.user_id) {
      let opt = {
        url: GET_RECEIVE_MAIL_URL,
        data: {
         // user_id: this.user.user_id
        }
      }
      //let list = await this.requestApi(opt)
      let list = {
        "errno": 0,
        "data": [{
            "user_id": "1",
            "mail_id": "1",
            "poster_url": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1534016080759&di=5578d267bb43ad31cfe8ad0419024eac&imgtype=0&src=http%3A%2F%2Fimg5.duitang.com%2Fuploads%2Fitem%2F201411%2F02%2F20141102115809_FavJH.thumb.700_0.jpeg",
            "friend_name": "何娇羞",
            "friend_addr": "",
            "friend_email": "",
            "arrived_time": "2018.08.20",
            "create_time": "2018.08.02",
            "cover": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1534015977245&di=2f862303a3adeb50bc27fb65503bae93&imgtype=0&src=http%3A%2F%2Fcdnq.duitang.com%2Fuploads%2Fitem%2F201504%2F08%2F20150408H1237_L42Ym.jpeg",
            "is_read": ""
        }]
      }
      if (list.errno === 0) {
        list = list.data
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
      if(res.errno !== 0){
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
        success () {
          wx.navigateBack()
        }
      })
    }
  }
})