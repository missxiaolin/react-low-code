import{j as e,u as I}from"./index-CISSGvlG.js";import{S as v}from"./SettingModal-DIaRTxTF.js";import{V as h}from"./VsEditor-BbPnUSbt.js";import{V as k}from"./VariableBind-BSOFLFce.js";import"./util-BKa5BsPH.js";import"./index-Be0loznV.js";import"./index-Cd8mrToj.js";const o=window.antd.Form,w=window.antd.Input,y=window.antd.Space,F=window.antd.InputNumber,M=window.icons.MinusCircleOutlined,b=window.icons.PlusOutlined,C=function(){return e.jsxs(e.Fragment,{children:[e.jsx(o.Item,{label:"请求头",children:e.jsx(o.List,{name:"headers",children:(s,{add:c,remove:l})=>e.jsx(e.Fragment,{children:s.map(({name:r},a)=>e.jsxs(y,{align:"center",style:{marginBottom:s.length===a+1?0:10},children:[e.jsx(o.Item,{name:[r,"key"],noStyle:!0,children:e.jsx(w,{placeholder:"请输入Key"})}),e.jsx(o.Item,{name:[r,"value"],noStyle:!0,children:e.jsx(k,{placeholder:"请输入Value"})}),e.jsx(b,{onClick:()=>c({key:"",value:""})}),a>0&&e.jsx(M,{onClick:()=>{l(r)}})]},`header-${a}`))})})}),e.jsx(o.Item,{label:"超时时间",name:"timeout",children:e.jsx(F,{addonAfter:"秒"})}),e.jsx(o.Item,{label:"超时提示",name:"timeoutErrorMessage",children:e.jsx(w,{placeholder:"请输入超时提示"})}),e.jsx(o.Item,{label:"请求适配",name:"requestInterceptor",children:e.jsx(h,{})}),e.jsx(o.Item,{label:"返回适配",name:"responseInterceptor",children:e.jsx(h,{})})]})},S=window.React.forwardRef,O=window.React.useImperativeHandle,R=window.React.useState,f=window.antd.Form,V=window.antd.Modal,P=({update:s},c)=>{const{page:l,setInterceptor:r}=I(d=>d),{interceptor:a}=l,[i]=f.useForm(),[p,u]=R(!1),m={headers:[{key:"",value:""}],timeout:8,timeoutErrorMessage:"请求超时，请稍后重试",requestInterceptor:`/**
 * config: 请求完整配置，请严格按照以下格式使用和返回
 * config.url: 请求地址,eg: config.url = 'https://xxx/api/xxx'
 * config.params: Get请求对应参数,eg: config.params = {name:'xxx'}
 * config.data: Post请求对应数据,eg: config.data = {name:'xxx'}
 * config.timeout: 超时时间（秒）,eg: config.timeout = 5
 * config.headers: 请求头,eg: config.headers.token = 'xxx'
 */
function request(config){
    return config;
}`,responseInterceptor:`/**
* response: 返回值完整结构
* response.config: 请求完整配置。
* response.data: 请求返回数据
* response.headers: 请求头
* response.status: 请求状态码
*/
function response(response){
    return response;
}`};O(c,()=>({showModal:()=>{i.setFieldsValue({...m,...a}),u(!0)}}));async function t(){await i.validateFields()&&(r(i.getFieldsValue()),n())}function n(){u(!1),i.resetFields()}return e.jsx(V,{width:"800px",okText:"确认",cancelText:"取消",title:"高级设置",open:p,onOk:t,onCancel:n,children:e.jsx(f,{form:i,labelCol:{span:4},wrapperCol:{span:19},style:{maxWidth:800},autoComplete:"off",children:e.jsx(C,{})})})},$=S(P),j=window.React.useRef,g=window.antd.Button,B=window.antd.Flex,x=window.antd.List,E=window.icons.PlusOutlined,L=window.icons.SettingOutlined,G=()=>{const s=j(),c=j(),{page:l,removeApi:r}=I(t=>t),{apis:a}=l,i=()=>{var t;(t=s.current)==null||t.showModal()},p=(t,n)=>{var d;t.preventDefault(),(d=s.current)==null||d.showModal(n.id)},u=(t,n)=>{t.preventDefault(),r(n)},m=()=>{var t;(t=c.current)==null||t.showModal()};return e.jsxs(e.Fragment,{children:[e.jsxs(B,{justify:"space-between",align:"center",style:{borderBottom:"1px solid var(--l-theme-card-border-color)"},children:[e.jsx(g,{type:"link",icon:e.jsx(E,{}),onClick:()=>i(),children:"新增"}),e.jsx(g,{type:"link",icon:e.jsx(L,{}),onClick:()=>m(),children:"全局拦截器"})]}),e.jsx(x,{style:{height:"calc(100vh - 150px)",overflowY:"auto"},itemLayout:"horizontal",dataSource:Object.values(a),renderItem:t=>e.jsx(x.Item,{actions:[e.jsx("a",{onClick:n=>p(n,t),children:"修改"}),e.jsx("a",{onClick:n=>u(n,t.id),children:"删除"})],children:e.jsx(x.Item.Meta,{title:`${t.method} ${t.name}`,description:t.url})})}),e.jsx(v,{ref:s}),e.jsx($,{ref:c})]})};export{G as default};
