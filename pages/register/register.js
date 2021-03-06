// pages/register/register.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkCodeViewHidden: true,
    authHidden: true,
    prompt: "正在登录……",
    loginHidden: false,
    email: undefined,
    checkCode: undefined,
    getCheckCodePrompt: "获取验证码",
    checkCodeBtnRefreshTime: 10, //这是常量，获取验证码按钮点击后的恢复时间
    leftTime: 0, //

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('onload')
    //获取用户唯一id，openid
    //前端直接获取，不用请求后台了
    //然后赋值给全局变量
    let _this = this;
    wx.login({
      success: function(res) {
        
        if (res.code) {
          // console.log('获取到的code：' + res.code)
          let appid = 'wx17b5bf3e88b69c45';
          let jsCode = res.code;
          let secret = 'd68a3f7ab161d83b8ffd7044ab71d289';
          let url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + jsCode + '&grant_type=authorization_code';
          // console.log('requestUrl:'+url);
          wx.request({
            url: url,
            success: function(res) {
              // console.log(res);
              getApp().data.openid = res.data.openid;
              _this.checkIsBindEmail(res.data.openid);
            },
            fail: function(res) {
              console.log('请求openid失败');
            }
          })

        } else {
          console.log('jscode获取失败！' + res.errMsg);
        }
      },
      fail: function(res) {
        console.log('请求jscode失败');
      }
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if(this.data.out){
      if(this.data.isLogin){
        this.data.out=false;
        wx.navigateTo({
          url: '../index/index',
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.data.out=true;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.data.out=true;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  emailInput: function(e) {
    this.data.email = e.detail.value;
    // console.log(this.data.email)
  },
  checkCodeInput: function(e) {
    this.data.checkCode = e.detail.value;
    // console.log(this.data.checkCode)
  },
  //验证验证码
  bindEmail: function() {
    // console.log('绑定邮箱')
    let checkCode = this.data.checkCode;
    let email = this.data.email;
    if (!checkCode || checkCode.length == 0) {
      wx.showToast({
        title: '未输入验证码',
        icon: 'none',
        duration: 3000
      });
    } else if (!email || email.length == 0) {
      wx.showToast({
        title: '未输入邮箱',
        icon: 'none',
        duration: 3000
      });
    } else {
      let vuid = getApp().data.openid;
      let email = this.data.email;
      let check_code = this.data.checkCode;
      let user_name = getApp().data.nickName;
      let user_img = getApp().data.picUrl;
      let _this = this;
      wx.request({
        url: 'http://193.112.91.187/yoyou/public/index.php/index/index/check_verification_code', //仅为示例，并非真实的接口地址
        data: {
          data: {
            vuid: vuid,
            email: email,
            check_code: check_code,
            user_name: user_name,
            user_img: user_img
          }
        },
        method: 'GET',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          if (res.data.errno == 0) {
            _this.bindEmailSuccess()
          } else {
            _this.bindEmailFail();
          }
        },
        fail: function(res) {
          console.log("绑定邮箱网络失败")
          _this.bindEmailFail()

        }
      })
      //todo 这个很坑啊，不能用回调控制消失？
      wx.showToast({
        title: '数据加载中',
        icon: 'loading',
        duration: 3000
      });
      // this.bindEmailFail()
      // this.bindEmailSuccess()
    }
  },
  bindEmailSuccess: function() {
    wx.showToast({
      title: '绑定成功',
      icon: 'loading',
      duration: 2000
    });
    //redirect到主页
    wx.redirectTo({
      url: '../index/index'
    })

  },
  bindEmailFail: function() {
    wx.showToast({
      title: '网络错误',
      icon: 'none',
      duration: 2000
    });
  },
  //向后台申请生产验证码
  generateCheckCodeByEmail: function() {
    if (this.data.leftTime > 0) return;
    let email = this.data.email;
    if (email) {
      if (email.length > 0) {
        // console.log('获取验证码')
        this.onGetCheckCodeBtn(email)
      } else {
        wx.showToast({
          title: '未输入邮箱',
          icon: 'none',
          duration: 3000
        });
      }
    } else {
      wx.showToast({
        title: '未输入邮箱',
        icon: 'none',
        duration: 3000
      });
    }

  },
  onGetCheckCodeBtn: function(email) {
    //先设置按钮禁用，倒计时后恢复
    this.updateGetCheckCodeBtn(this.data.checkCodeBtnRefreshTime);
    //然后要求服务器生成验证码
    this._generateCheckCodeByEmail(email);
  },
  updateGetCheckCodeBtn(time) {
    if (time == 0) {
      this.setData({
        getCheckCodePrompt: "获取验证码"
      })
    } else {
      this.setData({
        getCheckCodePrompt: --time + "s后可点"
      })
      let _this = this;
      setTimeout(function() {
        _this.updateGetCheckCodeBtn(time)
      }, 1000)
    }
    this.data.leftTime = time;
  },
  _generateCheckCodeByEmail(email) {
    wx.request({
      url: 'http://193.112.91.187/yoyou/public/index.php/index/index/get_verification_code', //仅为示例，并非真实的接口地址
      data: {
        data: {
          vuid: getApp().data.openid,
          email: email
        }
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {
        if (res.data.errno == 0) {
          console.log("生产验证码成功")
        } else {
          console.log("生成验证码失败")
        }
      },
      fail: function(res) {
        console.log("请求服务器生成验证码网络失败")
      }
    })
  },
  //获取授权函数,获取授权后会获取用户名和头像url，并设置为全局变量
  //nickName 用户名
  //picUrl 头像url
  bindGetUserInfo: function() {
    let _this = this;
    wx.getUserInfo({
      success: function(res) {
        console.log(res.userInfo)
        let app = getApp()
        app.data.nickName = res.userInfo.nickName;
        app.data.picUrl = res.userInfo.avatarUrl;
        wx.showToast({
          title: '授权成功',
          icon: 'success',
          duration: 2000
        });
        _this.setData({
          checkCodeViewHidden: false,
          authHidden: true
        })
      }
    })


  },
  //绑定了邮箱则可进入首页，否则提示进入注册页
  checkIsBindEmail(openid) {
   
    console.log('todo，根据openid询问后台' + openid);
    let _this = this;
    //现在默认跳去主页，之后要注册成功才能跳过去
    this.getUserNameAndPic()
    // this.loginSuccess()

    // this.gotoRegister(_this);
    // 之后要注释掉上面的代码，现在只是为了方便调试。下面的代码要取消注释

    wx.request({
      url: 'http://193.112.91.187/yoyou/public/index.php/index/index/is_registered', //仅为示例，并非真实的接口地址
      data: {
        data: {
          vuid: openid
        }
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function(res) {

        let errno = res.data.errno;
        
          if (errno == 0) {
            console.log('errno 0')
            console.log(res.data.data.is_registered)
            if (res.data.data.is_registered == 1) {

              //注册了可以去首页
              getApp().data.userid = res.data.data.user_id;
              getApp().data.nickName = res.data.data.user_name;
              

              //  todo，注册过的，服务器会保存昵称和头像url，这里要赋值一下
              _this.loginSuccess();
            } else {
              //要去注册了
              _this.gotoRegister();
            }
          } else {
            //要去注册了
            _this.gotoRegister();
          }
        
      },
      fail: function(res) {
        console.log('请求是否注册服务失败！')
      }
    })

  },

  getUserNameAndPic: function() {
    wx.getUserInfo({
      success: function(res) {
        let app = getApp()
        app.data.nickName = res.userInfo.nickName;
        app.data.picUrl = res.userInfo.avatarUrl;
        console.log(app.data.nickName)
      },
      fail: function(res) {
        console.log('获取用户昵称、头像失败：' + res)
      }
    })
  },
  loginSuccess: function() {    
    wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 2000,
      success(){
        wx.navigateTo({
          url: '../index/index'
        })
      }
    });
    this.data.isLogin = true;
  },
  gotoRegister: function() {
    wx.showToast({
      title: '请先注册',
      icon: 'none',
      duration: 2000
    });
    this.setData({
      authHidden: false,
      loginHidden: true
    })
  }
})