import HomeLogo from '../home/HomeLogo.jpg';
import { motion } from 'framer-motion';

const HomeView = () => {
    return (
        <div>
            <motion.h2 initial={{ opacity: 0, x: '-100vw' }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, type: 'spring', stiffness: 120 }}
                whileHover={{ scale: 1.1 }}
            >
                Добре дошли в нашето приложение за политически дебати!
            </motion.h2>
            <motion.img initial={{ x: -500, rotateX: -720, rotateZ: -180, rotateY: -180, y: 500 }}
                animate={{ y: 0, x: 0, rotateX: 0, rotateY: 0, rotateZ: 0 }}
                transition={{ delay: 0, type: 'spring', stiffness: 15 }}
                whileHover={{ scale: 1.1 }}
                className="post" style={{ borderRadius: "15px" }} src={HomeLogo} alt="Website main logo" />
        </div>
    )
}

export default HomeView;