import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Menubar from "../../components/header/Menubar";
import Rating from '../../components/rating/Rating';
import { useNavigate } from 'react-router-dom';
import "../list/list.css";
import "../list/productCategoryImg.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTag, faCube, faWonSign, faWarehouse, faWrench } from '@fortawesome/free-solid-svg-icons';

const GundamList = () => {
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortCriteria, setSortCriteria] = useState(null);
    const [filterType, setFilterType] = useState(null);
    const itemsPerPage = 8;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductsAndReviews = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL;
                const [productResponse, reviewResponse] = await Promise.all([
                    axios.get(`${apiUrl}/products`),
                    axios.get(`${apiUrl}/reviews`)
                ]);

                console.log("Product Response Data: ", productResponse.data);

                const filteredProducts = productResponse.data.rows.filter(product => product.category_id === 1);
                console.log("Filtered Products: ", filteredProducts);

                const productsWithReviewCount = filteredProducts.map(product => {
                    const productReviews = reviewResponse.data.filter(review => review.productid === product.id);
                    return { ...product, reviewCount: productReviews.length };
                });

                setProducts(productsWithReviewCount);
                setReviews(reviewResponse.data);
            } catch (error) {
                console.error("There was an error fetching the data!", error);
            }
        };

        fetchProductsAndReviews();
    }, []);

    useEffect(() => {
        if (sortCriteria) {
            setProducts(prevProducts => [...prevProducts].sort(sortCriteria));
        }
    }, [sortCriteria]);

    const filteredProducts = filterType 
        ? products.filter(product => product.type === filterType) 
        : products;

    const calculateAverageRating = (productId) => {
        const productReviews = reviews.filter(review => review.productid === productId);
        if (productReviews.length === 0) return 0;
        const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / productReviews.length).toFixed(1);
    };

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const selectedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleProductClick = (id) => {
        navigate(`/products/${id}`);
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ko-KR').format(price);
    };

    const sortByNewest = (a, b) => new Date(b.product_created_at) - new Date(a.product_created_at);
    const sortByLowestPrice = (a, b) => a.new_price - b.new_price;
    const sortByHighestPrice = (a, b) => b.new_price - a.new_price;
    const sortByDiscountRate = (a, b) => b.discountedPrice - a.discountedPrice;
    const sortByMostReviews = (a, b) => b.reviewCount - a.reviewCount;
    const sortByHighestRating = (a, b) => calculateAverageRating(b.id) - calculateAverageRating(a.id);

    const handleSort = (sortFunction) => {
        setSortCriteria(() => sortFunction);
    };

    const handleFilter = (event) => {
        const selectedType = event.target.value;
        setFilterType(selectedType === '전체' ? null : selectedType);
    };

    const getAbsoluteImageUrl = (image) => {
        const apiUrl = process.env.REACT_APP_API_IMAGE_URL;
        return `${apiUrl}${image}`;
    };

    return (
        <div>
            <Header />
            <Menubar />
            <div className="productListContainer">
                <div className="productList-content-top">
                    <div className="productList-content-img-gundam">
                    </div>
                </div>
                <div className="productList-content-middle">
                    <div className="productList-content-middle-position">
                        <div className="productList-content-middle-top">
                            <h4>건담 프라모델</h4>
                        </div>
                        <div className="productList-content-middle-bottom">
                            <div>
                                <select className="productList-filterDropdown" onChange={handleFilter}>
                                    <option value="전체">전체</option>
                                    <option value="EG">EG</option>
                                    <option value="HG">HG</option>
                                    <option value="RG">RG</option>
                                    <option value="MG">MG</option>
                                    <option value="PG">PG</option>
                                </select><span className="filter-text">&nbsp;|&nbsp;</span>
                            </div>
                            <div>
                                <button className="productList-filterbtn" onClick={() => handleSort(sortByMostReviews)}>인기도순</button> <span className="filter-text">|&nbsp;</span>
                            </div>
                            <div>
                                <button className="productList-filterbtn" onClick={() => handleSort(sortByNewest)}>최신등록순</button> <span className="filter-text">|&nbsp;</span>
                            </div>
                            <div>
                                <button className="productList-filterbtn" onClick={() => handleSort(sortByLowestPrice)}>낮은가격순</button> <span className="filter-text">|&nbsp;</span>
                            </div>
                            <div>
                                <button className="productList-filterbtn" onClick={() => handleSort(sortByHighestPrice)}>높은가격순</button> <span className="filter-text">|&nbsp;</span>
                            </div>
                            <div>
                                <button className="productList-filterbtn" onClick={() => handleSort(sortByDiscountRate)}>할인율순</button> <span className="filter-text">|&nbsp;</span>
                            </div>
                            <div>
                                <button className="productList-filterbtn" onClick={() => handleSort(sortByMostReviews)}>리뷰많은순</button> <span className="filter-text">|&nbsp;</span>
                            </div>
                            <div>
                                <button className="productList-filterbtn" onClick={() => handleSort(sortByHighestRating)}>평점높은순</button> <span className="filter-text">|&nbsp;</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="productList-content-bottom">
                    <div className="productList-content-bottom-products">
                        {selectedProducts.map((product) => (
                            <div key={product.id} className="productList-content-bottom-product" onClick={() => handleProductClick(product.id)}>
                                <img src={getAbsoluteImageUrl(product.image)} alt={product.productName} id='product-img' />
                                <div>
                                    <h4><FontAwesomeIcon icon={faBox} /> {product.productName}</h4>
                                </div>
                                <div id='productList-ratingContainer'>
                                    <Rating rating={calculateAverageRating(product.id)} /> <span>({product.reviewCount})</span>
                                </div>
                                <div>
                                    <p><FontAwesomeIcon icon={faTag} /> {product.category}</p>
                                </div>
                                <div>
                                    <p><FontAwesomeIcon icon={faCube} /> {product.type}</p>
                                </div>
                                <div>
                                    <p><FontAwesomeIcon icon={faWonSign} /> {formatPrice(product.price)}원 <span id='List-discount'>{product.discountedPrice}%</span></p>
                                </div>
                                <div>
                                    <p><FontAwesomeIcon icon={faWarehouse} /> {product.inventory}개</p>
                                </div>
                                <div>
                                    <p><FontAwesomeIcon icon={faWrench} /> {product.manufacturer}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="pagination-buttons">
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index + 1}
                                className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default GundamList;
