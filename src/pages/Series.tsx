import SerieForm from '@/components/serie/SerieForm';
import SerieList from '@/components/serie/SerieList';
import SerieView from '@/components/serie/SerieView';
import { Routes, Route } from 'react-router';

function Series() {
    return (
        <Routes>
            <Route path="/" element={<SerieList />} />
            <Route path="/new" element={<SerieForm />} />
            <Route
                path="/edit/:code"
                element={<SerieForm isEditing={true} />}
            />
            <Route path="/view/:code" element={<SerieView />} />
        </Routes>
    );
}

export default Series;
