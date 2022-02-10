import React from 'react';
import Layout from '@theme/Layout';
import * as Icons from '@fluentui/react-icons-mdl2'
import './icons.css';

const IconsPage = () => {

    // HACK: Fix broken TextDocumentSettingsIcon size https://github.com/microsoft/fluentui/issues/21645
    const iconComponentRef: React.RefObject<HTMLDivElement> = React.useRef()
    React.useEffect(() => {
        const svgElementRef = iconComponentRef.current?.children[0]?.children[0] as SVGElement
        if (svgElementRef) {
            svgElementRef.style.width = "36px"
            svgElementRef.style.height = "36px"
        }
    }, [iconComponentRef.current])

    const [copiedIconName, setCopiedIconName] = React.useState<string>();
    const [query, setQuery] = React.useState("")

    const icons = Object.entries(Icons).filter((icon) => {
        if (query === '') return icon
        if (icon[0].toLowerCase().includes(query.toLowerCase())) return icon
    }).reduce((acc, [iconName, iconComponent]) => {
        const icon = React.createElement(iconComponent as React.FC<React.HTMLAttributes<HTMLSpanElement>>, { style: { width: 36, height: 36 } })
        if ('displayName' in iconComponent) {
            acc[iconName.slice(0, -4)] = iconName === "TextDocumentSettingsIcon" ? <div ref={iconComponentRef}>{icon}</div> : icon
        }
        return acc
    }, {} as { [key: string]: JSX.Element })


    async function copyTextToClipboard(text: string) {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            return document.execCommand('copy', true, text);
        }
    }

    const handleCopyClick = (iconName: string) => {
        copyTextToClipboard(iconName)
            .then(() => {
                setCopiedIconName(iconName);
                setTimeout(() => {
                    setCopiedIconName('');
                }, 800);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <Layout title="Hello">
            <div style={{ padding: 72 }}>
                <h1>Icons</h1>
                <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit maxime commodi ullam optio ex id harum a aliquid voluptates minima aut similique temporibus voluptatibus provident repellendus, minus eaque. Excepturi, eveniet!</div>
                <br />
                <div className="searchBox" style={{ alignItems: 'center', justifyContent: 'center' }} >
                    {React.createElement(Icons["SearchIcon"], { style: { width: 18, height: 18 } })}
                    <input className="input" type="search" placeholder="Search icons" onChange={event => setQuery(event.target.value)} />
                </div>
                <br />
                <div
                    id="iconSet"
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '30px',
                    }}>
                    {Object.entries(icons).map(([iconName, iconElement]) => {
                        return <div key={iconName} style={{
                            textAlign: 'center',
                        }} >
                            <div
                                className='box'
                                style={{
                                    padding: 8,
                                    paddingTop: 38,
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                                onClick={() => { handleCopyClick(iconName) }}>
                                <div>{iconElement}</div>
                                <div className='iconName' >{iconName}</div>
                                <div className='copiedBox'>{copiedIconName === iconName && <div className="copied">Copied!</div>}</div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </Layout>
    );
}

export default IconsPage;