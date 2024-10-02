import Heatmap from "../components/Heatmap";
import Piechart from "../components/Piechart";
import Barchart from "../components/Barchart";

const Dashboard = () => {
    return (
        <>
        <div style={{paddingTop:"5%"}}>
        <Heatmap />
        <Piechart/>
        <Barchart/>
        </div>
          
            
        </>
    );
};

export default Dashboard;