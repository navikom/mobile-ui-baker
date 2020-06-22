import { REACT_NATIVE_LIB } from './Constants';

export function openTag(tag: string, props: string[] = []) {
  return `<${tag} ${props.join(' ')}>`;
}

export function closeTag(tag: string) {
  return `</${tag}>`;
}

export function closedTag(tag: string, props: string[] = []) {
  return `<${tag} ${props.join(' ')}/>`;
}

export function createComponent(component: string, props: string[], children: boolean) {
  if(children) {
    return `
  ${openTag(component, props)}
    { children && children }
  ${closeTag(component)}  
  `;
  }
  return closedTag(component, props);
}

export function importFrom(sources: string | string[], library: string = REACT_NATIVE_LIB) {
  return `import ${Array.isArray(sources) ? '{' + sources.join(', ') +  '}' : sources} from '${library}'`;
}
