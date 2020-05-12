<template>
  <div class="containers" ref="containers">
    <div id="js-canvas" class="canvas" ref="canvas"></div>
    <ul class="buttons">
      <li>下载</li>
      <li>
        <a ref="saveDiagram" href="javascript:" title="download BPMN diagram">BPMN diagram</a>
      </li>
      <li>
        <a ref="saveSvg" href="javascript:" title="download as SVG image">SVG image</a>
      </li>
      <el-upload :show-file-list="false" action="" :auto-upload="false" :on-change="changeFile" class="import">
        <li>
          <a slot="trigger" ref="import" href="javascript:" title="import BPMN diagram">导入 BPMN diagram</a>
        </li>
      </el-upload>
    </ul>
    <!-- Panel为自定义属性面板，需要传入element，businessObject，moddle，modeling -->
    <Panel ref="panel" :element="element" :businessObject="businessObject" :moddle="moddle" :modeling="modeling"/>
  </div>
</template>

<script>
  // @ is an alias to /src
  import Panel from '@/components/new3/Panel.vue'
  // 引入Modeler
  import BpmnModeler from 'bpmn-js/lib/Modeler'
  import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil'
  import activitiModdleDescriptor from 'activiti-bpmn-moddle/resources/activiti'
  // 用来进行国际化，参考官方的例子 bpmn-js-examples-master ===> i18n
  import customTranslate from '../i18n/translate'

  export default {
    components: {
      Panel
    },
    data () {
      return {
        businessObject:null,
        element:null,
        moddle:null,
        modeling:null,
        // bpmn建模器
        bpmnModeler: null,
        containers: null,
        canvas: null,
        xmlStr: null,
        customTranslateModule: {
          translate: [ 'value', customTranslate ]
        }
      }
    },
    methods:{
      openDiagram(xml){
        let _this = this
        this.bpmnModeler.importXML(xml, function(err) {
          if (err) {
            // container
            //     .removeClass('with-diagram')
            //     .addClass('with-error');
            console.error(err);
          } else {
            // container
            //   .removeClass('with-error')
            //   .addClass('with-diagram');
          }
          _this.moddle = _this.bpmnModeler.get('moddle')
          _this.modeling = _this.bpmnModeler.get('modeling')
        });
      },
      // 注意：必须先加载一个bpmn文件，新建就是加载一个空的bpmn文件，否则不能拖拽节点
      createNewDiagram(){
        /*let bpmnXmlStr = `<?xml version="1.0" encoding="UTF-8"?>
          <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="6.0.4">
            <process id="Process_1" isExecutable="true">
              <startEvent id="StartEvent_1acpsqt" />
            </process>
            <bpmndi:BPMNDiagram id="BpmnDiagram_1">
              <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1">
                <bpmndi:BPMNShape id="StartEvent_1acpsqt_di" bpmnElement="StartEvent_1acpsqt">
                  <omgdc:Bounds x="152" y="82" width="36" height="36" />
                </bpmndi:BPMNShape>
              </bpmndi:BPMNPlane>
            </bpmndi:BPMNDiagram>
          </definitions>`
        this.openDiagram(bpmnXmlStr) */

        var diagramUrl = 'https://cdn.staticaly.com/gh/bpmn-io/bpmn-js-examples/dfceecba/starter/diagram.bpmn';
        // var diagramUrl = 'http://localhost:8080/newDiagram.bpmn';
        this.$http.get(diagramUrl)
                  // 这里必须使用箭头函数，否则提示找不到openDiagram方法
                  .then((res)=>{
            //console.log(res.data)
            this.openDiagram(res.data)
        })
        .catch((err)=>{
            console.log(err)
        })
      },
      // 下载为SVG格式,done是个函数，调用的时候传入的
      saveSVG (done) {
        // 把传入的done再传给bpmn原型的saveSVG函数调用
        this.bpmnModeler.saveSVG(done)
      },
      // 下载为SVG格式,done是个函数，调用的时候传入的
      saveDiagram (done) {
        // 把传入的done再传给bpmn原型的saveXML函数调用
        this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
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
          _this.bpmnModeler.importXML(newXml, function (err) {
            if (err) {
              console.error(err)
            }
          })
        }
      }
    },
    mounted() {
      // 获取到属性ref为“containers”的dom节点
      this.containers = this.$refs.containers
      // 获取到属性ref为“canvas”的dom节点
      const canvas = this.$refs.canvas
      // 建模，官方文档这里讲的很详细
      this.bpmnModeler = new BpmnModeler({
        container: canvas,
        additionalModules: [
          // 国际化
          this.$data.customTranslateModule
        ],
        moddleExtensions: {
          activiti: activitiModdleDescriptor
        }
      })

      // 下载画图
      let _this = this
      // 获取a标签dom节点
      const downloadLink = this.$refs.saveDiagram
      const downloadSvgLink = this.$refs.saveSvg
      // 给图绑定事件，当图有发生改变就会触发这个事件
      this.bpmnModeler.on('commandStack.changed', function () {
        _this.saveSVG(function (err, svg) {
          _this.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg)
        })

        _this.saveDiagram(function (err, xml) {
          _this.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml)
        })
      })


      this.bpmnModeler.on('bpmnElement.added',(event)=>{
        _this.element = event.element
        _this.businessObject = getBusinessObject(_this.element)
        _this.$nextTick(()=>{
          _this.$refs.panel.init()
        })
      })
      this.bpmnModeler.on('element.click',(event)=>{
        event.originalEvent.preventDefault()
        event.originalEvent.stopPropagation()
        _this.element = event.element
        _this.businessObject = getBusinessObject(_this.element)
        _this.$nextTick(()=>{
          _this.$refs.panel.init()
        })
      })


      //let eventBus = this.bpmnModeler.get('eventBus')
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
  /*右边属性面板样式*/
  @import '~bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';

  .containers {
    position: absolute;
    background-color: #ffffff;
    width: 100%;
    height: 110%;

    .canvas {
      width: 100%;
      height: 100%;
    }

    .panel{
      position: absolute;
      right: 0;
      top: 0;
      width: 300px;
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