import App from "next/app"
import Layout from "../components/Layout/Layout"
import 'semantic-ui-css/semantic.min.css'

class MernApp extends App  {
    render() {
        const {Component} = this.props
    return (
        <Layout>
        <Component />
        </Layout>
    ) 
}   
}

export default MernApp;