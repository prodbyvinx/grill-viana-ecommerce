import Header from './_components/header'
import Categories from './_components/categories'
import PicCarousel from './_components/carousel'
import Conditions from './_components/conditions'
import Promos from './_components/promos'
import WhoWeAre from './_components/whoweare'
import HomeRatings from './_components/homeratings'

export default function Home() {
    return (
        <>
            <Header />
            <Categories />
            <PicCarousel />
            <Conditions />
            <WhoWeAre />
            <HomeRatings />
        </>
    )
}