export default function Input({ id = '', text = '', type = 'text', value, setValue}) {
  return(
    <label htmlFor={id} className="relative block w-full overflow-hidden border-b border-gray-200 bg-transparent pt-3 focus-within:border-blue-600 dark:border-gray-700">
      <input
        type={type}
        id={id}
        placeholder={text}
        autoComplete="off"
        onChange={(e)=> setValue(e.target.value)}
        value={value}
        className="peer h-8 w-full border-none bg-transparent p-0 placeholder-transparent focus:border-transparent focus:outline-none focus:ring-0 sm:text-base dark:text-white"
      />
      <span className="absolute cursor-pointer start-0 top-2 -translate-y-1/2 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs dark:text-gray-200">
        {text}      
      </span>
    </label>
  )
}