
export default function ProfileHeader() {
    return (
        <section className="header">
        <div className="user-container">
            <img src="https://via.placeholder.com/150" alt="User" />
            <h1>John Doe</h1>
        </div>
        <div className="friend-container">
            <p>friend count</p>
            <p>friends</p>
        </div>
        <div className="enemy-container">
            <p>enemy count</p>
            <p>enemies</p>
        </div>
        </section>
    
    );
}