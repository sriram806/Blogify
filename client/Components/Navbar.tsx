const listItems = [
    { name: 'Home', href: '#' },
    { name: 'About', href: '#' },
    { name: 'Features', href: '#' },
    { name: 'Contact', href: '#' },
]

const Navbar = () => {
    return (
        <div>
            <div className='fixed left-1/2 -translate-x-1/2 top-5 
                flex justify-between items-center gap-32 
                py-3 px-10 rounded-full 
                bg-white/10 backdrop-blur-lg border border-white/20
                text-white shadow-lg z-10'>
                <ul className='flex gap-12 text-lg'>
                    {listItems.map((item) => (
                        <li
                            key={item.name}
                            className='hover:text-gray-300 transition-colors duration-300'
                        >
                            <a href={item.href}>{item.name}</a>
                        </li>
                    ))}
                </ul>

                <button
                    className="
                        bg-linear-to-r from-yellow-300/70 to-amber-400/70
                        backdrop-blur-md
                        py-1.5 px-6 rounded-full
                        border border-yellow-100/30
                      text-yellow-900 font-semibold
                        shadow-lg hover:from-yellow-300 hover:to-amber-400
                        hover:shadow-yellow-300/40
                        transition-all duration-300
                    "
                >
                    _blogify
                </button>

            </div>
        </div>
    )
}

export default Navbar
