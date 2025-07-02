'use client'
import { FaAsterisk } from "react-icons/fa";
import { useState } from "react"

type SupportInputProps = {
    name: string;
    label: string;
    important: boolean;
    textarea?: boolean;
    fileupload?: boolean;
};

export default function SupportInput({ name, label, important, textarea, fileupload }: SupportInputProps) {
    const [text, setText] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [fileSelected, setFileSelected] = useState(false);

    const isActive = isFocused || text.length > 0 || fileSelected

    // 공통 속성
    const commonProps = {
        name,
        autoComplete: "off",
        onFocus: () => setIsFocused(true),
        onBlur: () => setIsFocused(false),
        className: `w-full pt-0 pb-1.5 md:pb-3 border-b ${isFocused ? "border-primary-blue-300 border-b-2" : "border-gray-400"
            } transition-all duration-300`
    };

    return (
        <div className="w-full pt-5 text-14-medium md:text-18-medium">
            <div className={`flex ${isActive ? "items-center" : "items-end"}  gap-0.5`}>
                <span
                    className={`${isActive ? "opacity-100 text-primary-blue-300" : "opacity-0"} transition-opacity duration-500`}
                >
                    {label}
                </span>
                <FaAsterisk className={`${important ? "block" : "hidden"} w-2 h-2 text-red-500`} />
            </div>
            {
                fileupload ? (
                    <input
                        {...commonProps}
                        type="file"
                        onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                                setFileSelected(true);
                            } else {
                                setFileSelected(false);
                            }
                        }}
                    />
                ) : textarea ? (
                    <textarea
                        {...commonProps}
                        rows={isFocused ? 8 : 1}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={isFocused ? `` : label}
                    />
                ) : (
                    <input
                        {...commonProps}
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={isFocused ? `` : label}
                    />
                )
            }
        </div>
    )
}