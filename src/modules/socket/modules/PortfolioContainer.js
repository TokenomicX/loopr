import React from 'react'
import PropTypes from 'prop-types';
class TransactionsSocketContainer extends React.Component {
  constructor(props, context) {
    super(props, context)
    this.state = {
      items:[],
      filters:{},
    }
  }
  componentDidMount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }

    const query = {
      owner:window.WALLET && window.WALLET.getAddress(),
    }
    socket.emit('portfolio_req',JSON.stringify(query))
    socket.on('portfolio_res', (res)=>{
      console.log('portfolio_res')
      res = JSON.parse(res)
      if(!res.error){
        this.setState({
          items:res.data,
        })
      }
    })
  }
  componentWillUnmount() {
    const { socket } = this.context
    if (!socket) {
      console.log('socket connection has not been established')
      return false
    }
    socket.off('portfolio_res')
  }
  filtersChange({filters={},page={}}){
    this.setState({
      ...this.state,
      filters:{
        ...this.state.filters,
        ...filters,
      },
      page:{
        ...this.state.page,
        ...page
      }
    })
  }
  pageChange({page={}}){
    this.setState({
      ...this.state,
      page:{
        ...this.state.page,
        ...page
      }
    })
  }
  render() {
    const {children,...rest} = this.props
    const childProps = {
      ...rest,
      LIST:{
        ...this.state,
      },
      actions:{
        filtersChange:this.filtersChange.bind(this),
        pageChange:this.pageChange.bind(this),
      }
    }
    const {render} = this.props
    if(render){
      return render.call(this,childProps)
    }
    return (
      <div>
         {
           React.Children.map(this.props.children, child => {
               return React.cloneElement(child, {...childProps})
           })
         }
      </div>
    )
  }
}
TransactionsSocketContainer.contextTypes = {
  socket: PropTypes.object.isRequired
};
export default TransactionsSocketContainer
