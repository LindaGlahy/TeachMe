

/* * Review Model * */

const getReviews = () => JSON.parse(localStorage.getItem("reviews")) || [];
let reviews = getReviews();
class Review {
    id = '';
    student = '';
    teacher = '';
    lesson = '';
    rating = 0;
    comments = '';
    date = '';
    constructor(id, student, teacher, lesson, rating, comments, date) {
        this.id = id;
        this.student = student;
        this.teacher = teacher;
        this.lesson = lesson;
        this.rating = rating;
        this.comments = comments;
        this.date = date || new Date().toISOString();
    }
}


function createReview(id,student,teacher,lesson,rating,comment) {
    const review = new Review(
        id,
        student,
        teacher,
        lesson,
        rating,
        comment,
        new Date().toISOString()
    );
    reviews.push(review);
    localStorage.setItem("reviews", JSON.stringify(reviews));
    return review;
}


function deleteReview(id) {
    let reviews = getReviews();
    reviews = reviews.filter(r => r.id != Number(id));
    localStorage.setItem("reviews", JSON.stringify(reviews));
}

export { getReviews, createReview, deleteReview };