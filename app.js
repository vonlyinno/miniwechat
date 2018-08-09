
App({
  data:{
    //getApp().data.openid 可以获取全局的openid
    openid:undefined
  },
  onLaunch:function(){
    //获取用户唯一id，openid
    //前端直接获取，不用请求后台了
    //然后赋值给全局变量
    let _this=this;
    wx.login({
      success: function (res) {
        let __this=_this;
        if (res.code) {
          // console.log('获取到的code：' + res.code)
          let appid = 'wx17b5bf3e88b69c45';
          let jsCode = res.code;
          let secret = 'd68a3f7ab161d83b8ffd7044ab71d289';
          let url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + jsCode + '&grant_type=authorization_code';
          // console.log('requestUrl:'+url);
          wx.request({
            url: url,
            success:function(res){
              // console.log(res);
              __this.data.openid = res.data.openid;
            },
            fail:function(res){
              console.log('请求openid失败');
            }
          })
          
        } else {
          console.log('jscode获取失败！' + res.errMsg);
        }
      },
      fail:function(res){
        console.log('请求jscode失败');
      }
    });
  }
})