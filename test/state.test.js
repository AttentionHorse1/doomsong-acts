import test from "node:test";
import assert from "node:assert/strict";
import {INITIAL_STATE,nextState,readState,phaseBadge} from "../src/state.js";
test("start enters preparation",()=>{const s=nextState(INITIAL_STATE,"start",100);assert.deepEqual([s.active,s.phase,s.round],[true,0,1]);});
test("cycle after act VI returns to preparation and increases round",()=>{let s=nextState(INITIAL_STATE,"start",100);for(let i=0;i<7;i++)s=nextState(s,"next",100+i);assert.equal(s.phase,0);assert.equal(s.round,2);});
test("previous wraps back to VI and cannot go below first round",()=>{let s=nextState(nextState(INITIAL_STATE,"start",100),"previous",101);assert.equal(s.phase,6);assert.equal(s.round,1);});
test("stop clears indicator",()=>{const s=nextState(nextState(INITIAL_STATE,"start",100),"stop",101);assert.equal(phaseBadge(s),undefined);});
test("invalid metadata is sanitized",()=>{assert.equal(readState({active:true,phase:900,round:-5,revision:-1}).phase,0);});
