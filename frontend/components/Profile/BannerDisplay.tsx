interface ProfileBannerProps {
  name: string;
  coins: number;
}
export function ProfileBanner({ name, coins }: ProfileBannerProps) {
  return (
    <div className="banner-container">
      <div className="banner-left">
        <img
          className="profilePicture"
          src="/ProfilePicture.png"
          alt="profile picture"
        />
        <p className="username-display"> {name} </p>
      </div>
      <p className="coins-display"> Coins: {coins}</p>
    </div>
  );
}
