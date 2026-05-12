import { useCallback, useEffect, useState } from "react"
import Loading from "../components/Loading";
import PayslipList from "../components/payslip/PayslipList";
import GeneratePayslipForm from "../components/payslip/GeneratePayslipForm";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import api from "../api/axios";
import { withMinLoader } from "../utils/loaderDelay";

const PaySlips = () => {
  const [payslips, setPayslips] = useState([])
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true);
  const {user} = useAuth()
  const isAdmin = user?.role === "ADMIN";
  const isManager = user?.role === "MANAGER";
  const canIssuePayslips = isAdmin || isManager;
  const showEmployeeColumn = canIssuePayslips;

  const fetchPayslips = useCallback(async () => {
    setLoading(true);

    try {
      const res = await withMinLoader(() => api.get('/payslips'));
      setPayslips(Array.isArray(res.data.data) ? res.data.data : []);
    } catch (error) {
      toast.error(error?.response?.data?.error || error?.message);
      setPayslips([]);
    } finally {
      setLoading(false);
    }
  }, [])

  useEffect(()=>{
    fetchPayslips()
  },[fetchPayslips])

  useEffect(() => {
    if (canIssuePayslips) {
      api
        .get("/employees")
        .then((res) =>
          setEmployees(
            Array.isArray(res.data)
              ? res.data.filter((e) => !e.isDeleted)
              : []
          )
        )
        .catch((err) => {
          console.log(err);
          setEmployees([]);
        });
    }
  }, [canIssuePayslips])

  if(loading) return <Loading />

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="page-title">Payslips</h1>
          <p className="page-subtitle">{canIssuePayslips ? (isManager ? "Generate and view team payslips" : "Generate and manage employee payslips") : "Your payslip history"}</p>
        </div>
        {canIssuePayslips && <GeneratePayslipForm employees={employees} onSuccess={fetchPayslips}/>}
      </div>
      <PayslipList payslips={payslips} showEmployeeColumn={showEmployeeColumn}/>
      
    </div>
  )
}

export default PaySlips