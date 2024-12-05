import HomeIcon from '@mui/icons-material/Home';
import { useLocation, useSearchParams, useNavigate } from 'react-router';
const SecondHeader = ({ text }) => {
    const navigate = useNavigate()
    return <div className="justify-center flex relative">
        <div onClick={() => navigate("/")} className="hover:border-blue-500 hover:bg-blue-400 hover:text-white text-blue-500 w-10 h-10 flex items-center justify-center border rounded-full pointer cursor-pointer absolute left-0 translate-y-[-50%] top-[50%]">
            <HomeIcon />
        </div>
        <h1 className='text-black text-xl font-black text-blue-500'>{text}</h1>
    </div>
}

export default SecondHeader;