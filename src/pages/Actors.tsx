import ActorForm from '@/components/actor/ActorForm';
import ActorList from '@/components/actor/ActorList';
import ActorView from '@/components/actor/ActorView';
import { Routes, Route } from 'react-router';

function Actors() {
    return (
        <Routes>
            <Route path="/" element={<ActorList />} />
            <Route path="/new" element={<ActorForm />} />
            <Route
                path="/edit/:code"
                element={<ActorForm isEditing={true} />}
            />
            <Route path="/view/:code" element={<ActorView />} />
        </Routes>
    );
}

export default Actors;
