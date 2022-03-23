<template>
  <el-container class ='home-container'>
<!--    <el-header >
    <div>
      <img src="../assets/wind.png" >
      <span>极兔物流追踪平台</span>
    </div>
    <el-button type="info" @click="loginOut" size ="small">退出</el-button>
    </el-header> -->

	<el-header style=" font-size: 12px">
		<div>
		<!-- <img src="../assets/bird.png" > -->
		  <span style="color: #409EFF;font-size: 20px;">跟单管理平台</span>
		</div>
		<div class="user-setting">
			<el-dropdown @command="handleCommand" placement='top-start'>
			  <i class="el-icon-setting" style="margin-right: 4px"></i>
			  <el-dropdown-menu slot="dropdown">
			    <el-dropdown-item command="logout" >退出</el-dropdown-item>
<!-- 			    <el-dropdown-item>新增</el-dropdown-item>
			    <el-dropdown-item>删除</el-dropdown-item> -->
			  </el-dropdown-menu>
			</el-dropdown>
			<span style="color: #409EFF;margin-left: 10px;">{{username}}</span>

		</div>

	 </el-header>
    <el-container>
      <!-- width 设置为none 这样是由子元素撑起了的大小 当子元素被折叠时 样式变小 -->
      <el-aside :width=" isCollapse ? '64px' :'200px' ">
        <div class="fold-button" @click="foldMenu">III</div>

        <el-menu
              class="el-menu-vertical"
              background-color="#DCDFE6"
              text-color="#303133"
              active-text-color="#303133"
              unique-opened
              ref = 'asideMenuRef'
              :collapse ="isCollapse"
              :collapse-transition= "false"
              router
              :default-active="pathState"
              >
              <!-- 一级菜单 -->
              <el-submenu :index="item.id +'' " v-for=" item in menuList" :key = "item.id">

                <template slot="title">
                  <i :class="iconObj[item.id]"></i>
                  <span>{{item.authName}}</span>
                </template>
                <!-- 二级菜单 -->
                  <el-menu-item :index="'/'+itemChilden.path " v-for= "itemChilden in item.children" :key ="itemChilden.id"
                  @click = "saveNavState( '/'+itemChilden.path )"
                  >
                    <template slot="title">
                      <i class="el-icon-s-order"></i>
                      <span>{{itemChilden.authName}}</span>
                    </template>
                  </el-menu-item>

              </el-submenu>

            </el-menu>

      </el-aside>
      <el-main>
        <router-view>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [{'id':'101','authName':'跟单管理','children':[{'path':'tasks','id':'1','authName':'跟单看板'},
      ]}

	  ],
      iconObj: {
        101: 'el-icon-s-grid',
        102: 'fa el-icon-s-order',
        103: 'fa fa-bars',
        125: 'fa fa-address-book-o',
        145: 'fa fa-area-chart  '
      },
      isCollapse: false,
      pathState: '',
	  username:""
    }
  },
  created () {
    this.pathState = window.sessionStorage.getItem('pathState');
	this.username = window.sessionStorage.getItem('username');
  },
  methods: {

    async getMenus () {
      // console.log('created')
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.mesg)
        return
      }
      this.menuList = res.data
    },
    foldMenu () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (pathState) {
      window.sessionStorage.setItem('pathState', pathState)
      this.pathState = pathState
    },
	handleCommand(command) {
		window.sessionStorage.removeItem('token');
		this.$message.success('成功退出');
		this.$router.push('/login');

	}
  }
}
</script>

<style lang="less" scoped>
  .home-container{
    height: 100%;

  }
  .el-header{
    //background-color:#666666 ;
    display: flex;
    //justify-content: space-between;
    // padding-left: 0px;
    align-items: center;
    padding-left: 0px;
    color: #C0C4CC;
    div{
      height: 100%;
      display: flex;
      align-items: center;
    }
    img{
      max-width: 100%;
      max-height: 100%;
      border-radius: 50%;
    }
    span{
      margin-left: 20px;
    }
  }
  .el-aside{
    background-color:#909399 ;
    .fa{
      margin-right: 10px;
    }
    .el-menu{
      border-right: 0px;
    }
  }
  .el-main{
    background-color:#e9edf1 ;
  }
  .fold-button{
    line-height: 20px;
    font-size: 10px;
    text-align: center;
    background-color: #545b70;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .user-setting{
	  //margin-left: 70%;
	  //float: right;
	  margin-left:auto;
  }
</style>
