import React from 'react';
import { Component } from 'react';
import { Button } from '../Button/Button';
import { ImageGallery } from '../ImageGallery/ImageGallery';
import { Loader } from '../Loader/Loader';
import { Searchbar } from '../Searchbar/Searchbar';
import { getImages } from '../Services';
import { Container } from './App.styled';
import toast, { Toaster } from 'react-hot-toast';

export class App extends Component {
  state = {
    images: [],
    searchQuery: '',
    page: 1,
    loading: false,
    error: false,
    showBtn: false,
  };

  async componentDidUpdate(_, prevState) {
    if (
      prevState.searchQuery !== this.state.searchQuery ||
      prevState.page !== this.state.page
    ) {
      this.setState({ loading: true });
      try {
        const image = await getImages(this.state);
        this.setState(prevState => ({
          images: [...prevState.images, ...image.hits],
          showBtn: this.state.page < Math.ceil(image.totalHits / 12),
        }));
      } catch (error) {
        this.setState({ error: true });
      } finally {
        this.setState({ loading: false });
      }
    }
  }

  handleSubmit = searchQuery => {
    this.setState({ searchQuery, page: 1, images: [] });
  };

  handleLoadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  render() {
    const { loading, images, error, showBtn } = this.state;

    return (
      <Container>
        <Toaster position="bottom-left" />
        <Searchbar onSubmit={this.handleSubmit}></Searchbar>
        {error && toast.error('Whoops! Error! Please reload this page!!!')}
        {images.length > 0 && <ImageGallery elements={images} />}
        {showBtn && <Button onClick={this.handleLoadMore} />}
        {loading && <Loader />}
      </Container>
    );
  }
}
