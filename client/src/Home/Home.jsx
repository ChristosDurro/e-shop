
import { Link } from "react-router-dom";
import bigEclipse from "../assets/site_images/big-eclipse.svg"
import smallEclipse from "../assets/site_images/mid-eclipse.svg"
import "./Home.css"


const Home = () => {
  return (
	<div className="home">
		<img className="big-circle" src={bigEclipse} alt="big circle background image" />
		<img className="small-circle" src={smallEclipse} alt="small circle background image" />
		<h1 className="welcome">Welcome to e-Shop</h1>
		<Link to="/products" className="browse">Brose Products</Link>
	</div>
  )
}

export default Home;