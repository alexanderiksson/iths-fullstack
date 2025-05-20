export default function Loader() {
    return (
        <div className="fixed inset-0 w-screen h-screen flex justify-center items-center">
            <div className="flex flex-row gap-2">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-.5s]"></div>
            </div>
        </div>
    );
}
