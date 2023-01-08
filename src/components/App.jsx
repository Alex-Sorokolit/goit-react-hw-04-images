import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import './App.css';
import Modal from './Modal/Modal';
import Loader from './Loader/Loader';
import getImages from '../services/Api';

export function App() {
  const [searchInput, setSearchInput] = useState('');
  const [hits, setHits] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function Fetch(searchInput, page) {
      setIsLoading(true);
      setError(null);
      try {
        // Запит на бекенд
        const imagesData = await getImages(searchInput, page);
        const { hits, totalHits } = imagesData;

        // Перевірка чи є результати пошуку
        if (hits.length === 0) {
          toast.error('За вашим запитом немає результатів');
          return;
        }

        // Забираємо тільки ті дані які потрібні
        const filteredData = imagesData.hits.map(
          ({ id, tags, webformatURL, largeImageURL }) => ({
            id,
            tags,
            webformatURL,
            largeImageURL,
          })
        );

        // Записуємо дані у стейт
        setHits(prevHits => [...prevHits, ...filteredData]);
        setTotal(totalHits);

        // Показуємо кількість результатів при першому запиті
        if (page === 1) {
          toast.success(`Знайдено ${totalHits} результатів`);
        }
      } catch (error) {
        setError('Щось пішло не так, перезавантажте сторінку');
      } finally {
        setIsLoading(false);
      }
    }
    if (searchInput !== '') {
      Fetch(searchInput, page);
    }
  }, [searchInput, page]);

  const onSubmit = inputData => {
    if (searchInput === inputData) {
      toast.error(`Проявляйте креатив, пришіть різні запити`);
      return;
    }
    setSearchInput(inputData);
    setHits([]);
    setPage(1);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const setActiveImage = urlBigImage => {
    setSelectedImage(urlBigImage);
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
    console.log(page);
  };

  return (
    <div className="App">
      <Searchbar onSubmit={onSubmit} />

      {hits.length > 0 && (
        <ImageGallery hits={hits} selectImg={setActiveImage} />
      )}
      {isLoading && <Loader />}

      {!isLoading && hits.length > 0 && total > hits.length && (
        <Button loadMore={loadMore} />
      )}
      {selectedImage && (
        <Modal onClose={closeModal}>
          {selectedImage && <img src={selectedImage} alt="" />}
        </Modal>
      )}
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: 'rgba(255, 255, 255, 0.8)',
            },
          },
          error: {
            style: {
              color: 'black',
              background: 'rgba(255, 255, 255, 0.8)',
            },
          },
        }}
      />
      {error && <h2>{error}</h2>}
    </div>
  );
}
