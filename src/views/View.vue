<template>
  <div class="containers" ref="containers">
    <div id="js-canvas" class="canvas" ref="canvas"></div>
    <ul class="buttons">
      <li>
        <a ref="saveDiagram" href="javascript:" title="download BPMN diagram">下载 BPMN diagram</a>
      </li>
      <li>
        <a ref="saveSvg" href="javascript:" title="download as SVG image">下载 SVG image</a>
      </li>
      <el-upload :show-file-list="false" action="" :auto-upload="false" :on-change="changeFile" class="import">
        <li>
          <a slot="trigger" ref="import" href="javascript:" title="import BPMN diagram">导入 BPMN diagram</a>
        </li>
      </el-upload>
    </ul>
  </div>
</template>

<script>
  import BpmnJS from 'bpmn-js'
  export default {
    data () {
      return {
        bpmnViewer: null,
        containers: null,
        canvas: null,
        xmlStr: null
      }
    },
    methods: {
      // 注意：必须先加载一个bpmn文件，新建就是加载一个空的bpmn文件，否则不能拖拽节点
      createNewDiagram(){
        let _this = this
        var diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
        this.$http.get(diagramUrl)
                .then(function(res){
                  _this.bpmnViewer.importXML(res.data, function(err){
                    if (!err) {
                      console.log('success!')
                      _this.bpmnViewer.get('canvas').zoom('fit-viewport')
                      console.log('success...')
                    } else {
                      console.log('something went wrong:', err)
                    }
                  })
                })
                .catch(function(err){
                  console.log(err)
                })
      },
      // 下载为SVG格式,done是个函数，调用的时候传入的
      saveSVG (done) {
        // 把传入的done再传给bpmn原型的saveSVG函数调用
        this.bpmnViewer.saveSVG(done)
      },
      // 下载为SVG格式,done是个函数，调用的时候传入的
      saveDiagram (done) {
        // 把传入的done再传给bpmn原型的saveXML函数调用
        this.bpmnViewer.saveXML({ format: true }, function (err, xml) {
          done(err, xml)
        })
      },
      // 当图发生改变的时候会调用这个函数，这个data就是图的xml
      setEncoded (link, name, data) {
        // 把xml转换为URI，下载要用到的
        const encodedData = encodeURIComponent(data)
        // 获取到图的xml，保存就是把这个xml提交给后台
        this.xmlStr = data
        // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
        if (data) {
          link.className = 'active'
          link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
          link.download = name
        }
      },
      // 导入文件
      changeFile(file){
        let _this = this
        let reads = new FileReader()
        let f = file.raw
        reads.readAsText(f, 'utf-8')
        reads.onload = function (e) {
          let newXml = e.target.result
          _this.bpmnViewer.importXML(newXml, function (err) {
            if (!err) {
              console.log('success!')
              _this.bpmnViewer.get('canvas').zoom('fit-viewport')
              console.log('success...')
            } else {
              console.log('something went wrong:', err)
            }
          })
        }
      }
    },
    mounted() {
      // 获取到属性ref为“containers”的dom节点
      this.containers = this.$refs.containers
      // 获取到属性ref为“canvas”的dom节点
      this.canvas = this.$refs.canvas
      this.bpmnViewer = new BpmnJS({
        container: this.canvas
      })

      // 下载画图
      let _this = this
      // 获取a标签dom节点
      const downloadLink = this.$refs.saveDiagram
      const downloadSvgLink = this.$refs.saveSvg
      // 给图绑定事件，当图有发生改变就会触发这个事件
      this.bpmnViewer.on('canvas.viewbox.changed', function () {
        _this.saveSVG(function (err, svg) {
          _this.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg)
        })

        _this.saveDiagram(function (err, xml) {
          _this.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml)
        })
      })

      //let eventBus = this.bpmnViewer.get('eventBus')
      //console.log('eventBus', eventBus)

      this.createNewDiagram()
    }
  }
</script>
<style lang="scss">
  /*左边工具栏以及编辑节点的样式*/
  @import '~bpmn-js/dist/assets/diagram-js.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import '~bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

  .containers {
    position: absolute;
    background-color: #ffffff;
    width: 100%;
    height: 110%;

    .canvas {
      width: 100%;
      height: 100%;
    }

    .buttons{
      position: absolute;
      left: 20px;
      bottom: 20px;
      &>li{
        display:inline-block;margin: 5px;
        &>a{
          color: #999;
          background: #eee;
          cursor: not-allowed;
          padding: 8px;
          border: 1px solid #ccc;
          &.active{
             color: #333;
             background: #fff;
             cursor: pointer;
          }
        }
      }
    }

    .import{
      display: inline-block;
      margin:5px;
      li{
        list-style: none;
        a{
          color: #333;
          padding: 8px;
          border: 1px solid #ccc;
        }
      }
    }

    .bjs-powered-by {
      display: none;
    }
  }
</style>