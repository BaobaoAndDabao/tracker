<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">跟单管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>拦截件管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="100" type="flex">

           <el-col :span="8">
                  <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="待拦截的单号"
                    v-model="order_nos_text">
                  </el-input>
           </el-col>

           <el-col :span="8">
            <el-button type="primary" class="label" icon="el-icon-search" @click='getTaskList'>拦截</el-button>
            <el-button type="warning" class="label" :disabled="button_disable" > <i class="iconfont icon-yunxiazai" @click="download"  >导出</i></el-button>

           </el-col>

      </el-row>

      <el-row>
        <el-table :data="orderList" row-key="order_no" style="width: 100%" border v-loading="loading"
        :row-class-name="tableRowClassName" height="500px"  @selection-change="handleSelectionChange">>
          <el-table-column
                type="selection"
                width="55">
              </el-table-column>
          <el-table-column type="index" width="60" align="center" label="序号"></el-table-column>
          <el-table-column prop="order_no" label="运单号" align="center" width="160"></el-table-column>
          <el-table-column prop="process_type" align="center" label="操作类型"  width="120"></el-table-column>
          <el-table-column prop="remark" align="center" label="备注"  width="200"></el-table-column>
          <el-table-column prop="process_time" label="操作时间"  width="180" align="center"></el-table-column>
          <el-table-column prop="process_detail" align="center" label="操作详情"  width="260"></el-table-column>
 -->         <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="handleDelete(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryPageInfo.pagenum"
          :page-sizes="[10, 20, 30, 40,80,100,200]"
          :page-size="queryPageInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryPageInfo.total"
        ></el-pagination>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import baseUrl from '../setBaseUrl.js';
export default {
  data() {
    return {
      queryPageInfo: {
        query: '',
        pagenum: 1,
        pagesize: 30,
        total: 0
      },
      task_info:{
        percentage :0,
        type: 'msg',
        status:''
      },
      order_nos_text:'',
      latest_scane_types:['装车发件','卸车到件','问题件扫描','快件取出扫描','快件揽收',
      '留仓件入库','集货到件','入仓扫描','拦截件扫描','发件扫描','建包扫描','卸车扫描','拆包扫描','中心到件','到件扫描'],
      button_disable :false,
      all_networks:[],
      latest_scane_type:'',
      network_name:'',
      customer_name:'',
      selectedDate: '',
      orderList: [{order_no:"JT5093417796631",process_type:"正常拦截",process_detail:"已拦截",remark:"成功",process_time:"2022-01-30:14:20:55"},
      {order_no:"JT5093417796632",process_type:"派送拦截",process_detail:"已下问题件,已拦截,已留言",remark:"成功",process_time:"2022-01-29:14:12:15"},
      {order_no:"JT5093417796633",process_type:"未揽收",process_detail:"无",remark:"失败",process_time:"2022-01-29:14:12:15"}
      ],
      fileList: [],
      upload_url: baseUrl + 'upload',
      headers: { token: window.sessionStorage.getItem('token') },
      pickerOptions:{    //日期禁选项
          disabledDate(time) {
            var now = new Date();
            now.setTime(now.getTime()-24*60*60*1000*3)
            return time.getTime() > now;
          }
          },
      multipleSelection:[],
      latest_scane_network_name:''
    };
  },
  methods: {
    async query_search_latest_scane_network_name(queryString, cb){
      console.log(queryString);

      const { data: res } = await this.$http.get('get_latest_scane_network_names',{params: { like_network_name:queryString}});
      var latest_scane_network_names = res.latest_scane_network_names;
      var results = [];
      for (var i = 0; i < latest_scane_network_names.length; i++) {
        var latest_scane_network_name = latest_scane_network_names[i];
        results.push({"value":latest_scane_network_name});
      }
      cb(results);
    },
    async get_customer_names(queryString, cb){
      console.log(queryString);

      const { data: res } = await this.$http.get('get_customer_names',{params: { like_customer_name:queryString}});
      var customer_names = res.customer_names;
      var results = [];
      for (var i = 0; i < customer_names.length; i++) {
        var customer_name = customer_names[i];
        results.push({"value":customer_name});
      }
      cb(results);
    },
    batch_delete() {
      var order_nos = [];
      for (var i = 0; i < this.multipleSelection.length; i++) {
        var order_no = this.multipleSelection[i].order_no;
        order_nos.push(order_no);
      }
      if(order_nos.length==0){
        this.$message.error("请勾选至少一个单号");
        return;
      }
      let data = {"order_nos":order_nos};
      this.$http.post(
              "batch_delete_problem_order_nos", data
            ).then((res) => {
              if(res.data.status == "success"){
                this.$message.success("删除成功");
                this.getTaskList();
              }else{
                this.$message.error("删除失败");
              }
            }).catch((value) => {
              this.$message.error("删除失败");
            })
    },
    handleSelectionChange(val) {
            this.multipleSelection = val;
            console.log(val)
          },
    async getNetworkNames() {
      const { data: res } = await this.$http.get('get_belongs_networks');
      var network_names = res.network_names;
      this.all_networks = network_names;
    },
    async sendMsg(){
      if(this.network_name==''  ){
        this.$message({
          type: 'warning',
          message: '揽货网点未选择!'
        });

        return;
      }

      const { data: res } = await this.$http.get('start_msg', {
        params: { network_name:this.network_name
        } //请求数据
      });
      //this.getProcess();
      this.task_info.percentage = 0;
      this.button_disable = true;
      this.timer = setInterval(this.getProcess, 5000);
    },
    async scrape(){
      if(this.network_name==''  ){
        this.$message({
          type: 'warning',
          message: '揽货网点未选择!'
        });
        return;
      }
      console.log(this.selectedDate);
      if(this.selectedDate=='' || this.selectedDate== null){
        this.$message({
          type: 'warning',
          message: '揽货日期未选择!'
        });
        return;
      }

      const { data: res } = await this.$http.get('start_scrape', {
        params: { network_name:this.network_name,pickup_date:this.selectedDate
        } //请求数据
      });
      //this.getProcess();
      this.task_info.percentage = 0;
      this.button_disable = true;
      this.timer = setInterval(this.getProcess, 5000);



    },
    async getProcess() {
      const { data: res } = await this.$http.get('get_progress');
      if(res.task_info == null){
        return;
      }
      this.task_info.status = res.task_info.status;;
      this.task_info.type =  res.task_info.type;
      this.task_info.percentage =  Math.floor(res.task_info.finished_num / res.task_info.count * 100);
      if(res.task_info.status == 1 ){
        clearInterval(this.timer);
        this.task_info.percentage = 100;
        this.button_disable = false;
        this.getTaskList();
        return;
      }
      if(res.task_info.status == 2) {
        clearInterval(this.timer);
        this.button_disable = false;
        return;
      }
    },
    format(percentage) {
      var process ='';
      if(this.task_info.status== 2){
        return '失败';
      }
      return percentage === 100 ? '完成' :  `${percentage}%`;
    },
    async getTaskList() {
      this.loading = true;
      // 优先使用单号查询
      if(this.order_nos_text.trim()!=""){
        const { data: res } = await this.$http.get('get_problems_orders_by_order_nos', {
          params: { order_nos_text: this.order_nos_text,pageNum:this.queryPageInfo.pagenum,
          pagesize: this.queryPageInfo.pagesize
          } //请求数据
        });
        var orderList = res.orders;
        this.queryPageInfo.total = res.totalCount;
        this.orderList = orderList;
        this.loading = false;
      }else{
        const { data: res } = await this.$http.get('get_all_problems_orders', {
          params: { pageNum: this.queryPageInfo.pagenum, pagesize: this.queryPageInfo.pagesize,
          network_name:this.network_name,pickup_date:this.selectedDate,
          latest_scane_network_name:this.latest_scane_network_name,customer_name:this.customer_name,
          latest_scane_type:this.latest_scane_type
          } //请求数据
        });
        var orderList = res.orders;
        this.queryPageInfo.total = res.totalCount;
        //this.orderList = orderList;
        this.loading = false;
      }


    },
    download() {
      // if(this.network_name==''  ){
      //   this.$message({
      //     type: 'warning',
      //     message: '揽货网点未选择!'
      //   });
      //   return;
      // }
      this.$http
        .get('download', //请求的url
          {
             params: { pageNum: this.queryPageInfo.pagenum, pagesize: this.queryPageInfo.pagesize,
        network_name:this.network_name,pickup_date:this.selectedDate,
        latest_scane_network_name:this.latest_scane_network_name,customer_name:this.customer_name,
        latest_scane_type:this.latest_scane_type
        }
          },
          {
            responseType: 'blob' //服务器返回的数据类型
          }
        )
        .then(res => {
          var content_disposition = res.headers['content-disposition'];
          var filename = content_disposition.split('UTF-8')[1];
          filename = filename.replace(/'/g,'');

          filename = decodeURI(filename);
          const content = res.data;
          const blob = new Blob([content]); //构造一个blob对象来处理数据
          const link = document.createElement('a'); //创建a标签
          link.download = filename; //a标签添加属性
          link.style.display = 'none';
          link.href = URL.createObjectURL(blob);
          document.body.appendChild(link);
          link.click(); //执行下载
          URL.revokeObjectURL(link.href); //释放url
          document.body.removeChild(link); //释放标签
        })
        .catch(err => {
          console.log(err);
        });
    },
    async handleDelete(row) {
      // this.$message({
      //   type: 'info',
      //   message: '暂不可用'
      // });
      console.log(row);
      var order_no = row.order_no;
      const { data: res } = await this.$http.get('update_problem_order_no', {
        params: { order_no:order_no, status: 2 } //请求数据
      });
      if(res.status=="success" ){
        this.$message({
          type: 'success',
          message: '删除成功'
        });
         this.getTaskList();
      }else{
        this.$message({
          type: 'error',
          message: '删除失败'
        });
      }


    },
    handleSetting(row) {
      this.$message({
        type: 'info',
        message: '暂不可用'
      });
    },
    handleSizeChange(pageSize) {
      this.queryPageInfo.pagesize = pageSize;
      this.getTaskList();
    },
    handleCurrentChange(currentPage) {
      this.queryPageInfo.pagenum = currentPage;
      this.getTaskList();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    uploadSuccess(res, file, fileList) {
      console.log(res);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    statusFormatter(row, column) {
      var status = row.status;
      if (status == '1') {
        return '已留言';
      }
      if (status == '0') {
        return '库存中';
      }
      return '进行中';
    },
    tableRowClassName({ row, rowIndex }) {
      var status = row.status;
      if (status == '2') {
        return 'success-row';
      }
      return '';
    },
    async updatePercentage() {
      var needUpdateList = [];
      for (var i = 0; i < this.taskList.length; i++) {
        var task = this.taskList[i];
        var task_id = task.task_id;
        if (task.status == '2') {
          continue;
        }
        needUpdateList.push(task_id);
      }
      var task_list_str = needUpdateList.join(',');
      const { data: res } = await this.$http.get('get_task_status', { params: { task_ids: task_list_str } });
      var task_statuses = res.task_status;
      for (var i = 0; i < this.taskList.length; i++) {
        var task = this.taskList[i];
        for (var j = 0; j < task_statuses.length; j++) {
          var task_status = task_statuses[j];
          if (task_status[0] == task.task_id) {
            //num = num.toFixed(2);
            var percentage = (task_status[2] / task_status[1]) * 100;
            percentage = percentage.toFixed(2);
            //Math.floor(percentage * 100) / 100
            task.percentage = Math.floor(percentage * 10) / 10;
          }
        }
      }

      console.log(this.taskList);
    }
  },
  async created() {
    await this.getTaskList();
    await this.getNetworkNames();
    await this.getProcess();
    //this.updatePercentage();
  },
  mounted() {
    //this.timer = setInterval(this.getProcess, 20000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="less">
body {
  margin: 0;
}
.el-table .success-row {
  background: #f0f9eb;
}

.label {
  margin-left: 15px;
  margin-right: 15px;
}
</style>
