import { useState,useEffect } from "react";
 import axios from "axios";



 const useFetchData=async(selectedState?:string,searchTerm?:string)=>{
    
    console.log('searchParmas',searchTerm)

    const [data,setData]=useState('');
    const [loading,setLoading]=useState(false);
    const [error,setError]=useState<string | null>(null)
    const [ selectedStateConst , setselectedStateConst] = useState<string| undefined>()

    useEffect(() => {
        if(selectedState !== ''){
            setselectedStateConst(selectedState)
        }
    },[selectedState])
    console.log('selectedState',selectedStateConst)

    useEffect(() => {
        if (!selectedStateConst) return;
        console.log("selel",selectedStateConst)
    
        const fetchData = async () => {

          console.log('searchitem',searchTerm)
          setLoading(true);
          setError(null);
          try {
            const endPoint = getEndPoint(selectedStateConst);
            console.log('parammmss',endPoint)
            const response = await axios.get(`${endPoint}?data=${searchTerm || ''}`);
            console.log("response",response)
  
            setData(response.data);
          } catch (error) {
            console.log(error)
          
            setError('Failed to fetch');
          } finally {
            setLoading(false); // Ensure loading state is reset
          }
        };
    
        fetchData();
         // Call the fetchData function
         console.log("fetchData",fetchData())
    
      }, [selectedStateConst, searchTerm]); // Add dependencies
    

    const getEndPoint=(state:string)=>{
        switch(state){
            case 'users':
                
            return 'http://localhost:4444/admin/users'

            case 'doctors':
            return 'http://localhost:4444/admin/doctors'

            case 'appointments':
                return 'http://localhost:4444/admin/appointments'

            default:
                return '';

        }

    }
   
  return { data, loading, error };
  
 }


 export default useFetchData