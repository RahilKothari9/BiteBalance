import Barchart from "../components/Barchart.jsx";
import Heatmap from "../components/Heatmap.jsx";
import Piechart from '../components/Piechart';

const Stats = () => {
 return (
    // <div className="bg-gray-100 min-h-screen p-4">
      // <Navbar /> 
      <div className="bg-secondary-50 max-w-6xl mx-auto pt-20 flex flex-col items-center">
        <h2 className="text-2xl font-semibold  text-gray-800 mb-6">User Statistics</h2>
        <div className="mb-6">
        <Barchart />
        </div>
        <div className="flex  justify-center mb-6 space-x-20 bottom-chart">
          <div className="flex-1">
            <Piechart />
          </div>
          <div className="flex-1 w-1000">
            
            <Heatmap />
          </div>
        </div>
      </div>
    // </div>
 );
};

export default Stats;