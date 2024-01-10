import { Button } from "@/components/ui/button";

const WelcomePage = () => {
    return (
        <div className="bg-white h-full flex flex-col items-center justify-center">
            <p className="text-lg font-bold pb-10">
                Welcome Page
            </p>
            <Button variant="destructive">
                Sign Up for the Course!
            </Button>
        </div>
    )
}

export default WelcomePage;