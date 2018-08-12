/*
 * @Author: tinniehe 
 * @Date: 2018-08-11 20:08:50 
 * @Last Modified by: tinniehe
 * @Last Modified time: 2018-08-12 13:57:16
 */

import { $wuxToast } from '../../components/index'
import regeneratorRuntime from '../../libs/regenerator-runtime'

const GET__MAIL_URL = 'http://193.112.91.187/manji/public/index.php/index/index/get_mail'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showRoutine: true,
    showBtnToRoutine: true,
    mail: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad (options) {
    // if(!options.mail_id) {
    //   wx.navigateBack()
    //   return
    // }
    if(options.type === 'mail') {
      //only mail
      this.setData({
        showRoutine: false,
        showBtnToRoutine: false
      })
    }
    let opt = {
      url: GET__MAIL_URL,
      data: {
        data: {
          //mail_id: options.mail_id
        }
      }
    }
    //let mail = await this.requestApi(opt)
    let mail = {
      "errno": 0,
      "data": {
          "user_id": "1",
          "mail_id": "1",
          "templet_id": 1,
          "poster_id": 1,
          "poster_url": "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1534016080759&di=5578d267bb43ad31cfe8ad0419024eac&imgtype=0&src=http%3A%2F%2Fimg5.duitang.com%2Fuploads%2Fitem%2F201411%2F02%2F20141102115809_FavJH.thumb.700_0.jpeg",
          "friend_name": "何娇羞",
          "friend_addr": "",
          "friend_email": "",
          "create_time": "2018.08.06",
          "arrived_time": "2018.08.22",
          "content":[{
            type: "text",
            text: "在写这篇文章之前，我询问了在唯品会和腾讯的童鞋、以及公司里面前端大神（深哥），对于设计稿切图的详细方法，经过对比验证，得出设计稿转换页面单位尺寸方法步骤。我分别询问下面四个问题："
          },{
            type: "pic",
            url: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1534015977245&di=2f862303a3adeb50bc27fb65503bae93&imgtype=0&src=http%3A%2F%2Fcdnq.duitang.com%2Fuploads%2Fitem%2F201504%2F08%2F20150408H1237_L42Ym.jpeg"
          }, {
            type: "text",
            text: "在写这篇文章之前，我询问了在唯品会和腾讯的童鞋、以及公司里面前端大神（深哥），对于设计稿切图的详细方法，经过对比验证，得出设计稿转换页面单位尺寸方法步骤。我分别询问下面四个问题："
          }, {
            type: "pic",
            url: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1534015977245&di=2f862303a3adeb50bc27fb65503bae93&imgtype=0&src=http%3A%2F%2Fcdnq.duitang.com%2Fuploads%2Fitem%2F201504%2F08%2F20150408H1237_L42Ym.jpeg"
          }],
          "time_line":[{
            "poster_status": "信使在北京迷路啦",
            "mood_time": "2018.08.03",
            "mood": ''
          },{
            "poster_status": "信使在北京迷路啦",
            "mood_time": "2018.08.05",
            "mood": '夜跑减肥，睡觉前进行夜跑，尽量保证30分钟以上，多喝水，可以吃少量低热量的食物。运动时会消耗大量血液和肝脏内的糖原，在睡觉时身体会自我调整体内平衡，燃烧脂肪补足血液和肝糖，从而达到减脂的效果。部分朋友跑步后很兴奋，以至于失眠睡不着，建议别太晚跑。 ​​​'
          },],
          "is_read": ""
      }
    }
    if(mail.errno === 0) {
      let mood = mail.data.time_line.filter((item) => {
        return item.mood !== ''
      })
      mail.data.mood_count = mood.length
      this.setData({
        mail: mail.data
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  showMail(){
    this.setData({
      showRoutine: false
    })
  },
  showRoutine(){
    this.setData({
      showRoutine: true
    })
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